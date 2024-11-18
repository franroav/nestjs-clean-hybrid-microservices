/* -------------------------------------------------------------------------- */
/*                                  AWS DATA                                  */
/* -------------------------------------------------------------------------- */

# account identity
data "aws_caller_identity" "current" {}

# ecr auth token 
data "aws_ecr_authorization_token" "token" {}

### External cli kubergrunt
data "aws_region" "current" {}

data "tls_certificate" "github_actions_oidc_endpoint" {
  url = var.github_actions_oidc_url
}

/* -------------------------------------------------------------------------- */
/*                                  AWS DATA POLICY                                   */
/* -------------------------------------------------------------------------- */


data "aws_iam_policy_document" "federated_assume_policy" {
  count = var.is_create_github_oidc ? 1 : 0

  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"

    principals {
      type        = "Federated"
      identifiers = [local.oidc_provider_arn]
    }

    condition {
      test     = "StringLike"
      variable = "${local.plain_oidc_url}:sub"

      values = flatten([for repo_name, repo_path in local.ecr_repos : ["repo:${repo_name}:*"]])
    }
  }
}




# data "external" "thumbprint" {
#   program = ["${path.module}/get_thumbprint.sh", data.aws_region.current.name]
# }

# github actions repository 
# data "github_actions_repository" "current" {}

# Calculate hash of the Docker image source contents
# data "external" "hash" {
#   program = [coalesce(var.hash_script, "${path.module}/hash.sh"), var.source_path]
# }


# data "tls_certificate" "github_actions_oidc_endpoint" {
#   url = var.github_actions_oidc_url
# }

# data "aws_iam_openid_connect_provider" "github_actions" {
#   url = "https://token.actions.githubusercontent.com"
# }

# data "aws_iam_openid_connect_provider" "this" {
#   arn = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"
# }

# data "aws_iam_openid_connect_provider" "github" {
#   count = var.is_create_github_oidc && !var.is_create_oidc_provider ? 1 : 0

#   url = var.github_actions_oidc_url
# }