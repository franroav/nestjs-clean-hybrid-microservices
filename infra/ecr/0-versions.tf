/* -------------------------------------------------------------------------- */
/*                                   PROVIDERS                                  */
/* -------------------------------------------------------------------------- */

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 3.74.2"
    }
    docker = {
      source  = "kreuzwerker/docker"
      version = ">= 2.13.0" # Specify a version compatible with your Terraform version
    }
  }
}

provider "aws" {
  region     = local.aws_region
  alias      = "us-east-1"
  profile    = local.aws_profile
  access_key = local.access_key
  secret_key = local.secret_key
  token      = local.token
}

provider "docker" {
  alias = "hashicorp"
  registry_auth {
    address  = local.ecr_reg
    username = data.aws_ecr_authorization_token.token.user_name
    password = data.aws_ecr_authorization_token.token.password
  }
  # source = "kreuzwerker/docker"
}



# terraform {
#   required_version = ">= 1.0"

#   required_providers {
#     aws        = "~> 4.29"
#     kubernetes = "~> 2.10"
#     helm       = "~> 2.5"
#     google     = "~> 4.34"
#   }
# }