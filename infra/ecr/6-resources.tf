
/* -------------------------------------------------------------------------- */
/*                                  TERRAFORM RESOURCES                       */
/* -------------------------------------------------------------------------- */


# CREATE REPOSITORIES

resource "aws_ecr_repository" "ecr_repos" {

  for_each = local.ecr_repos

  name                 = each.value
  image_tag_mutability = "MUTABLE"

  # this is very usefull because aws offers the capability of scannig docker images
  # it will be scanning if there is a hight vulnerability or a critical error, it will look for the operation system and the application 
  image_scanning_configuration {
    scan_on_push = true
  }

  force_delete = true # Add this line to force delete non-empty repositories

  tags = {
    env  = "dev"
    name = "${each.value}"
  }
}

#CREATE IMAGES
# Creates images from Dockerfiles on containers folder

# local-exec for build and push of docker image
resource "null_resource" "build_push_dkr_img" {
  for_each = aws_ecr_repository.ecr_repos

  triggers = {
    detect_docker_source_changes = var.force_image_rebuild == true ? timestamp() : local.dkr_img_src_sha256
  }

  provisioner "local-exec" {
    command = <<-EOT
      bash "${path.module}/scripts/env/production/push.sh" \
        "${local.dkr_img_src_path}/${each.key}" \
        "${local.ecr_reg}/${each.value.name}" \
        "${local.image_tag}"
    EOT

    interpreter = ["bash", "-c"] # Use bash to execute the command
  }

  depends_on = [aws_ecr_repository.ecr_repos]
}


# Github OpenID TLS certificate Configuration && AWS OpenID Policy Resources

resource "aws_iam_openid_connect_provider" "github_actions" {
  client_id_list   = [local.github_client_id]  # Add or Replace with your desired client IDs
  thumbprint_list  = [local.github_thumbprint] # Add or Replace with your desired thumbprints - GitHub OpenID TLS certificate thumbprint
  url              = local.url_workflow_provider  # Replace with your desired URL
}

# Create IAM OIDC Identity Provider

resource "aws_iam_role" "ecrpush" {
  count = var.is_create_github_oidc && var.is_create_ecrpush_oicd_role ? 1 : 0

  name                  = local.ecrpush_role_name
  path                  = var.iam_role_path
  max_session_duration  = var.max_session_duration
  description           = "IAM Role to be assumed by GitHub Action"
  force_detach_policies = var.force_detach_policies
  permissions_boundary  = var.iam_role_permissions_boundary

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      for repo_name, repo_path in local.ecr_repos : {
        Action   = "sts:AssumeRoleWithWebIdentity",
        Effect   = "Allow",
        Principal = {
          Federated = local.oidc_provider_arn,
        },
        Condition = {
          StringEquals = {
            "${local.plain_oidc_url}:sub"           = "repo:${repo_name}",
            "aws:PrincipalArn"                       = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:user/francisco",
          },
        },
      }
    ],
  })

  tags = merge(local.tags, { "Name" : local.ecrpush_role_name })
}

/* -------------------------------------------------------------------------- */
/*                             AWS_IAM_ROLE_POLICY                            */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/*                       AWS_IAM_ROLE_POLICY_ATTACHMENT                       */
/* -------------------------------------------------------------------------- */
resource "aws_iam_role_policy_attachment" "ecr_poweruser" {
  count = var.is_create_github_oidc && var.is_create_ecrpush_oicd_role ? 1 : 0

  role       = aws_iam_role.ecrpush[0].name
  policy_arn = var.ecr_poweruser_policy_arn
}



# # Create IAM OIDC Policy
# resource "aws_iam_policy" "github_oidc_policy" {
#   name        = "GitHubOIDCPolicy"
#   description = "Policy for GitHub OIDC authentication"

#   policy = jsonencode({
#     Version = "2012-10-17",
#     Statement = [
#       {
#         Action   = "sts:AssumeRoleWithWebIdentity",
#         Effect   = "Allow",
#         Principal = {
#           Federated = aws_identity_provider.github_oidc.arn,
#         },
#         Condition = {
#           StringEquals = {
#             "${aws_identity_provider.github_oidc.name}:sub" = "repo:${github.repository}",
#             "aws:PrincipalArn" = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:user/francisco",
#           },
#         },
#       },
#     ],
#   })
# }

# # Create IAM Role
# resource "aws_iam_role" "github_oidc_role" {
#   name               = "GitHubOIDCRole"
#   assume_role_policy = aws_iam_policy.github_oidc_policy.json
# }

# # Attach the IAM Policy to the IAM Role
# resource "aws_iam_role_policy_attachment" "github_oidc_attachment" {
#   policy_arn = aws_iam_policy.github_oidc_policy.arn
#   role       = aws_iam_role.github_oidc_role.name
# }



## Setup proper credentials to push to ECR

# resource "aws_ecr_replication_configuration" "ecr" {
#   replication_configuration {
#     rule {
#       dynamic "destination" {
#         for_each = toset(var.replication_regions)

#         content {
#           region      = destination.key
#           registry_id = data.aws_caller_identity.current.account_id
#         }
#       }

#       repository_filter {
#         filter_type = "PREFIX_MATCH"
#         filter      = "ps-"
#       }
#     }
#   }
# }
