// ------------------ //
// ZEROTIER VARIABLES //
// CONFIGURATION FILE //
// ------------------ //

// Before you even start, you need to ask yourself one question:
// "What is my biggest security concern with Terraform?"
// To which my counter would be: "How will you be protecting your secrets?"

// Enter the variables.tf file...
// I will be writing an artical about this but to keep it brief, its recommended 
// that you secure your Terraform Secrets by using Terraform Cloud Workspaces
// doing so allows you to create Enviorment Variables, that you reference to here
// in this file, usually in a format like such: ${TF_EXAMPLE_TOKEN}
// Doing it this way, we avoid leaking or hard coding secrets in you deployments...

variable {
    
} 
