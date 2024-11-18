
#!/bin/bash

set -e

source_path="$1"
repository_url="$2"
tag="${3:-latest}"

region="$(echo "$repository_url" | cut -d. -f4)"
image_name="$(echo "$repository_url" | cut -d/ -f2)"

cd "$source_path"

aws ecr get-login-password --region "$region" | docker login --username AWS --password-stdin "$repository_url"

docker build -t "${image_name}-repo:$tag" .

docker tag "${image_name}-repo:$tag" "${repository_url}:${tag}"

docker push "${repository_url}:${tag}"


# set -e

# source_path="$1"
# repository_url="$2"
# tag="${3:-latest}"

# region="$(echo "$repository_url" | cut -d. -f4)"
# image_name="$(echo "$repository_url" | cut -d/ -f2)"

# cd "$source_path"


# # Authenticate with ECR
# aws ecr get-login-password --region "$region" | docker login --username AWS --password-stdin "$repository_url"

# # Build the Docker image
# docker build -t "$image_name" .

# # Tag the Docker image
# docker tag "$image_name" "$repository_url":"$tag"

# # Push the Docker image to ECR
# docker push "$repository_url":"$tag"



# set -e

# source_path="$1"
# repository_url="$2"
# tag="${3:-latest}"

# region="$(echo "$repository_url" | cut -d. -f4)"
# image_name="$(echo "$repository_url" | cut -d/ -f2)"

# (cd "$source_path" && docker build -t "$image_name" .)

# aws ecr get-login-password --region "$region" | docker login --username AWS --password-stdin "$repository_url"
# docker tag "$image_name" "$repository_url":"$tag"
# docker push "$repository_url":"$tag"