/* -------------------------------------------------------------------------- */
/*                                   VARIABLES                                */
/* -------------------------------------------------------------------------- */

variable "username" {
  description = "username"
  default = "franroav"
}

variable "repository_provider" {
  description = "github"
  default = "https://github.com"
  
}

variable "workflow_provider" {
  description = "github workflow token"
  default = "https://token.actions.githubusercontent.com"
  
}

variable "force_image_rebuild" {
  type    = bool
  default = false
}

variable "TF_VAR_AWS_PROFILE" {
description = "aws user account MFA profile"
  type = string
  default = "system-admin"
  # default = "${secrets.TF_VAR_AWS_PROFILE}"
  #   sensitive = true
}

variable "TF_VAR_AWS_REGION" {
description = "aws account region"
  type = string
  # default = "${secrets.TF_VAR_AWS_REGION}"
#   sensitive = true
}

variable "TF_VAR_AWS_ACCOUNT_ID" {
description = "aws account id"
  type = string
  # default = "${secrets.TF_VAR_AWS_ACCOUNT_ID}"
#   sensitive = true
}

variable "TF_VAR_AWS_SESSION_TOKEN" {
description = "aws sts get-session-token"
  type = string
  # default = "${secrets.TF_VAR_AWS_SESSION_TOKEN}"
#   sensitive = true
}

variable "TF_VAR_AWS_SECRET_ACCESS_KEY" {
description = "aws secret access key"
  type = string
  # default = "${secrets.TF_VAR_AWS_SECRET_ACCESS_KEY}"
#   sensitive = true
}

variable "TF_VAR_AWS_ACCESS_KEY_ID" {
description = "aws sts aws access key id"
  type = string
  # default = "${secrets.TF_VAR_AWS_ACCESS_KEY_ID}"
#   sensitive = true
}


variable "tag" {
  description = "Tag to use for deployed Docker image"
  type        = string
  default     = "latest"
}

variable "hash_script" {
  description = "Path to script to generate hash of source contents"
  type        = string
  default     = ""
}

variable "push_script" {
  description = "Path to script to build and push Docker image"
  type        = string
  default     = ""
}

# variable "source_path" {
#   description = "Path to Docker image source"
#   type        = string
# }
/* -------------------------------------------------------------------------- */
/*                                   Generic                                  */
/* -------------------------------------------------------------------------- */

# variable "environment" {
#   description = "Environment Variable used as a prefix"
#   type        = string
# }

# variable "prefix" {
#   description = "The prefix name of customer to be displayed in AWS console and resource"
#   type        = string
# }

variable "tags" {
  description = "Custom tags which can be passed on to the AWS resources. They should be key value pairs having distinct keys"
  type        = map(any)
  default     = {}
}

/* -------------------------------------------------------------------------- */
/*                                     GitHub OIDC                            */
/* -------------------------------------------------------------------------- */

variable "is_create_github_oidc" {
  type        = bool
  description = "Flag to enable/disable the creation of GitHub OIDC resources."
  default     = true
}

variable "is_create_oidc_provider" {
  default     = true
  description = "Flag to enable/disable the creation of the GitHub OIDC provider."
  type        = bool
}


variable "github_actions_oidc_url" {
  type        = string
  description = "The URL to use for the OIDC handshake"
  default     = "https://token.actions.githubusercontent.com"

  validation {
    condition     = substr(var.github_actions_oidc_url, 0, 5) == "https"
    error_message = "The OIDC URL needs to start with https."
  }
}

# variable "github_repositories" {
#   description = "List of GitHub organization/repository names authorized to assume the role."
#   type        = list(string)

#   validation {
#     // Ensures each element of github_repositories list matches the organization/repository format used by GitHub.
#     condition = length([
#       for repo in var.github_repositories : 1
#       if length(regexall("^[A-Za-z0-9_.-]+?/([A-Za-z0-9_.:/-]+|\\*)$", repo)) > 0
#     ]) == length(var.github_repositories)
#     error_message = "Repositories must be specified in the organization/repository format."
#   }
# }

# variable "github_thumbprint" {
#   # default     = "6938fd4d98bab03faadb97b34396831e3780aea1"
#   description = "GitHub OpenID TLS certificate thumbprint."
#   type        = string
# }

/* -------------------------------------------------------------------------- */
/*                            SHARED_ROLE_VARIABLES                           */
/* -------------------------------------------------------------------------- */

variable "role_name_suffix" {
  description = "IAM role name to be <role_name><role_name_suffix>"
  type        = string
  default     = "GithubOIDCRole"
}

variable "iam_role_path" {
  default     = "/"
  description = "Path under which to create IAM role."
  type        = string
}

variable "iam_role_permissions_boundary" {
  default     = ""
  description = "ARN of the permissions boundary to be used by the IAM role."
  type        = string
}


variable "max_session_duration" {
  default     = 3600
  description = "Maximum session duration in seconds."
  type        = number

  validation {
    condition     = var.max_session_duration >= 3600 && var.max_session_duration <= 43200
    error_message = "Maximum session duration must be between 3600 and 43200 seconds."
  }
}

variable "force_detach_policies" {
  default     = false
  description = "Flag to force detachment of policies attached to the IAM role."
  type        = string
}

/* -------------------------------------------------------------------------- */
/*                              SHARED_ROLE_ARNS                              */
/* -------------------------------------------------------------------------- */

variable "ecr_poweruser_policy_arn" {
  description = "AWS built in ECR PowerUser access policy arn"
  type        = string
  default     = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser"
}


/* -------------------------------------------------------------------------- */
/*                             ECR_OIDC_ROLE                            */
/* -------------------------------------------------------------------------- */
variable "is_create_ecrpush_oicd_role" {
  description = "Whether to create ecr readwrite oidc role"
  type        = bool
  default     = false
}

variable "ecrpush_role_name_prefix" {
  description = "IAM role name to be <role_name>-GithubOIDCRole"
  type        = string
  default     = "ECR_ReadWrite"
}


/* -------------------------------------------------------------------------- */
/*                             SECURITY_SCAN_OIDC_ROLE                            */
/* -------------------------------------------------------------------------- */
variable "is_create_securityscan_oicd_role" {
  description = "Whether to create securityscan oidc role"
  type        = bool
  default     = false
}

variable "securityscan_role_name_prefix" {
  description = "IAM role name to be <role_name>-GithubOIDCRole"
  type        = string
  default     = "SecurityScan"
}

/* -------------------------------------------------------------------------- */
/*                             CUSTOM_USER_ROLE                            */
/* -------------------------------------------------------------------------- */
variable "is_create_custom_oicd_role" {
  description = "Whether to create custom oidc role"
  type        = bool
  default     = false
}

variable "custom_role_name_prefix" {
  description =  "IAM role name to be <role_name>-GithubOIDCRole"
  type        = string
  default = "custom"
}