/* -------------------------------------------------------------------------- */
/*                                  OUTPUTS                                */
/* -------------------------------------------------------------------------- */

output "account_id" {
  value = data.aws_caller_identity.current.account_id
}

output "caller_arn" {
  value = data.aws_caller_identity.current.arn
}

output "caller_user" {
  value = data.aws_caller_identity.current.user_id
}

# Output triggered by null_resource.build_push_dkr_img
output "trigged_by" {
  value = { for key, resource_instance in null_resource.build_push_dkr_img : key => resource_instance.triggers }
}

output "docker_build_context" {
  value = local.dkr_img_src_path
}

output "ecr_repository_urls" {
  description = "ECR URL's"
  value = { for key, repo in aws_ecr_repository.ecr_repos : key => repo.repository_url }
}


output "ecrpush_role_arn" {
  description = "The ARN of the ECR Push IAM Role"
  value       = var.is_create_github_oidc && var.is_create_ecrpush_oicd_role ? aws_iam_role.ecrpush[0].arn : null
}

output "ecrpush_role_name" {
  description = "The name of the ECR Push IAM Role"
  value       = var.is_create_github_oidc && var.is_create_ecrpush_oicd_role ? aws_iam_role.ecrpush[0].name : null
}

output "ecrpush_role_policy_attachment_arn" {
  value = var.is_create_github_oidc && var.is_create_ecrpush_oicd_role ? aws_iam_role_policy_attachment.ecr_poweruser[0].policy_arn : null
}

output "github_actions_oidc_provider_arn" {
  value = aws_iam_openid_connect_provider.github_actions.arn
}


# output "trigged_by" {
#   value = null_resource.build_push_dkr_img.triggers
# }


# output "docker_build_commands" {
#   value = local.dkr_build_cmds
# }

# output "docker_build_script" {
#   value = join("\n", [for repo_name, script in local.dkr_build_cmds : <<-SCRIPT
#     # ${repo_name}
#     ${script}

#     echo "Finished building and pushing Docker image for ${repo_name}"
#   SCRIPT
#   ])
# }

# # OICD Output variables
# output "oidc_provider_url" {
#   value = aws_identity_provider.github_oidc.url
# }

# output "iam_role_name" {
#   value = aws_iam_role.github_oidc_role.name
# }

# output "iam_role_arn" {
#   value = aws_iam_role.github_oidc_role.arn
# }

# output "iam_policy_arn" {
#   value = aws_iam_policy.github_oidc_policy.arn
# }

# to single repository 

# output "ecr_url" {
#   description = "The ECR URL"
#   value = try({ for key, repo in aws_ecr_repository.ecr_repos : key => repo.repository_url }, "")
# }