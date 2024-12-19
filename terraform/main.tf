provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source = "./modules/vpc"
  environment = var.environment
  project_name = var.project_name
}

module "ecs" {
  source = "./modules/ecs"
  environment = var.environment
  project_name = var.project_name
  vpc_id = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets
  public_subnets = module.vpc.public_subnets
}

module "rds" {
  source = "./modules/rds"
  environment = var.environment
  project_name = var.project_name
  vpc_id = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets
}

module "elasticache" {
  source = "./modules/elasticache"
  environment = var.environment
  project_name = var.project_name
  vpc_id = module.vpc.vpc_id
  private_subnets = module.vpc.private_subnets
} 