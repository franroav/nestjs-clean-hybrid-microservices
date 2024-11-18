
/* -------------------------------------------------------------------------- */
/*                                   LOCALS                                   */
/* -------------------------------------------------------------------------- */

locals {
  # MAIN CONFIGURATION - ... (existing locals remain unchanged)
  aws_account = data.aws_caller_identity.current.account_id # var.TF_VAR_AWS_ACCOUNT_ID
  aws_region  = "us-east-1"  #var.TF_VAR_AWS_REGION  # AWS region
  aws_profile = "system-admin" #var.TF_VAR_AWS_PROFILE # AWS profile
  alias       = "us-east-1"  #var.TF_VAR_AWS_REGION
  access_key  = var.TF_VAR_AWS_ACCESS_KEY_ID
  secret_key  = var.TF_VAR_AWS_SECRET_ACCESS_KEY
  token       = var.TF_VAR_AWS_SESSION_TOKEN


  # OpenId configuration
  github_client_id = "${var.repository_provider}/${var.username}" # Replace with your desired client IDs
  github_thumbprint = "${data.tls_certificate.github_actions_oidc_endpoint.certificates.0.sha1_fingerprint}" #var.github_thumbprint
  url_workflow_provider = var.workflow_provider

  # ECR configuration
  ecr_reg   = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${local.aws_region}.amazonaws.com" #"${locals.aws_account}.dkr.ecr.${local.aws_region}.amazonaws.com"
  # ecr_repo  = "demo"   # Default ECR repo name
  image_tag = "latest" # Default image tag version

  dkr_img_src_path   = "${path.module}/apps" # Docker image path
  dkr_img_src_sha256 = sha256(join("", [for f in fileset(".", "${local.dkr_img_src_path}/**") : filebase64(f)]))

  # Define a map for ECR repositories, ECR repo names
  ecr_repos = {
    api-gateway = "api-gateway",
    user-service = "user-service",
    cache-service = "cache-service",
    email-service = "email-service",
    risk-service = "risk-service",
    transaction-service = "transaction-service",
    payment-service = "payment-service",
    card-service = "card-service",
    billing-service = "billing-service",
    bank-service = "bank-service",
    order-service = "order-service",
    notification-service = "notification-service",
    client-service = "client-service",
    account-service = "account-service",
    customer-service = "customer-service",
    apps-service = "apps-service",
    delivery-service = "delivery-service",
    # Add more services as needed
  }

  # ECR ROLE configuration
  securityscan_role_name = format("securityscan-%s", var.role_name_suffix) # not in use - optionally
  ecrpush_role_name     = format("ecrpush-%s", var.role_name_suffix)
  custom_role_name      = format("custom-%s", var.role_name_suffix)
  
  # OPEN ID configuration
  oidc_provider_arn = aws_iam_openid_connect_provider.github_actions.arn
  plain_oidc_url    = trimprefix(var.github_actions_oidc_url, "https://")

  tags = merge(
    {
      Terraform   = true
      Environment = "development" # You may set a default value or remove this line if not needed
    },
    var.tags
  )

  # dkr_build_cmds = [for repo_name, repo_path in local.build_commands : <<-EOT
  #   cd ${local.dkr_img_src_path}/${repo_name}

  #   aws ecr get-login-password --region ${local.aws_region} | docker login --username AWS --password-stdin ${data.aws_caller_identity.current.account_id}.dkr.ecr.${local.aws_region}.amazonaws.com
    
  #   docker build -t ${repo_name}-repo:${local.image_tag} .

  #   docker tag ${repo_name}-repo:${local.image_tag} ${data.aws_caller_identity.current.account_id}.dkr.ecr.${local.aws_region}.amazonaws.com/${repo_name}-repo:${local.image_tag}

  #   docker push ${data.aws_caller_identity.current.account_id}.dkr.ecr.${local.aws_region}.amazonaws.com/${repo_name}-repo:${local.image_tag}

  # EOT
  # ]

#   dkr_build_cmds = {
#   for repo_name, repo_path in local.ecr_repos : repo_name => <<-EOT
#     cd ${local.dkr_img_src_path}/${repo_name}

#     aws ecr get-login-password --region ${local.aws_region} | docker login --username AWS --password-stdin ${data.aws_caller_identity.current.account_id}.dkr.ecr.${local.aws_region}.amazonaws.com

#     docker build -t ${repo_name}:${local.image_tag} .

#     docker tag ${repo_name}:${local.image_tag} ${data.aws_caller_identity.current.account_id}.dkr.ecr.${local.aws_region}.amazonaws.com/${repo_name}:${local.image_tag}

#     docker push ${data.aws_caller_identity.current.account_id}.dkr.ecr.${local.aws_region}.amazonaws.com/${repo_name}:${local.image_tag}

#   EOT
# }

# dkr_build_cmds = {
#   for repo_name, repo_path in local.ecr_repos : repo_name => <<-EOT
#     cd ${local.dkr_img_src_path}/${repo_name}
#     docker build -t ${local.ecr_reg}/${repo_name}:${local.image_tag} \
#       -f Dockerfile .

#     aws --profile ${local.aws_profile} ecr get-login-password --region ${local.aws_region} | \
#       docker login --username AWS --password-stdin ${local.ecr_reg}

#     docker push ${local.ecr_reg}/${repo_name}:${local.image_tag}
#   EOT
# }




# ...terraform commands    
# docker build -t ${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com/${REPO} .

# aws ecr get-login-password \
#     --region ${REGION} \
# | docker login \
#     --username AWS \
#     --password-stdin ${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com

# docker push ${ACCOUNT}.dkr.ecr.${REGION}.amazonaws.com/${REPO}


## LOOP OF IMAGES

# dkr_build_cmds = {
#   for repo_name, repo_path in local.ecr_repos : repo_name => <<-EOT
#     cd ${local.dkr_img_src_path}/${repo_name}
#     docker build -t ${local.ecr_reg}/${repo_name}:${local.image_tag} \
#       -f Dockerfile .

#     aws --profile ${local.aws_profile} ecr get-login-password --region ${local.aws_region} | \
#       docker login --username AWS --password-stdin ${local.ecr_reg}

#     docker push ${local.ecr_reg}/${repo_name}:${local.image_tag}
#   EOT
# }

## SEPARATES IMAGES 
# dkr_build_cmds = {
#   frontend = <<-EOT
#     cd ${local.dkr_img_src_path}/frontend
#     docker build -t ${local.ecr_reg}/${local.ecr_repos.frontend}:${local.image_tag} \
#       -f Dockerfile .

#     aws --profile ${local.aws_profile} ecr get-login-password --region ${local.aws_region} | \
#       docker login --username AWS --password-stdin ${local.ecr_reg}

#     docker push ${local.ecr_reg}/${local.ecr_repos.frontend}:${local.image_tag}
#   EOT

#   api = <<-EOT
#     cd ${local.dkr_img_src_path}/api
#     docker build -t ${local.ecr_reg}/${local.ecr_repos.api}:${local.image_tag} \
#       -f Dockerfile .

#     aws --profile ${local.aws_profile} ecr get-login-password --region ${local.aws_region} | \
#       docker login --username AWS --password-stdin ${local.ecr_reg}

#     docker push ${local.ecr_reg}/${local.ecr_repos.api}:${local.image_tag}
#   EOT
# }
}
# SINGLE IMAGES 
# locals {

# //////////////////////////////////////////////////////////////////////////////////////////////
# /////////////  Substitute below values to match your AWS account, region & profile //////////////////////////////////////////////////////////////////////////////////////////////
# #   aws_account = "111111111111"   # AWS account
#   aws_region  = "us-east-1"      # AWS region
#   aws_profile = "system-admin"   #"demo_terraform" # AWS profile
#   alias = "us-east-1"
#   access_key = var.TF_VAR_AWS_ACCESS_KEY_ID
#   secret_key = var.TF_VAR_AWS_SECRET_ACCESS_KEY
#   token      = var.TF_VAR_AWS_SESSION_TOKEN
#  ///////////////////////////////////////////////////////////////////////////////////////////// 
#   ecr_reg   = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${local.aws_region}.amazonaws.com"#"${local.aws_account}.dkr.ecr.${local.aws_region}.amazonaws.com" # ECR docker registry URI
#   ecr_repo  = "demo"                                                           # ECR repo name
#   image_tag = "latest"                                                         # image tag -> versión of the image 


#   dkr_img_src_path = "${path.module}/containers"                               # docker image path 
#   dkr_img_src_sha256 = sha256(join("", [for f in fileset(".", "${local.dkr_img_src_path}/**") : file(f)]))    

# # Docker Build Command:
#   dkr_build_cmd = <<-EOT
#         docker build -t ${local.ecr_reg}/${local.ecr_repo}:${local.image_tag} \
#             -f ${local.dkr_img_src_path}/Dockerfile .

#         aws --profile ${local.aws_profile} ecr get-login-password --region ${local.aws_region} | \
#             docker login --username AWS --password-stdin ${local.ecr_reg}

#         docker push ${local.ecr_reg}/${local.ecr_repo}:${local.image_tag}
#     EOT
# }
