# Organizing Terraform code accross teams, projects, and enviorments

[//]:"presentaition-by:Sorin_Lacriteanu"

---

# Topics

- Problem
- Solutions
- Outcome
- Demos
- Conclusions

---
[//]:"------------[Problem]---------------"

<details>
<summary>Problem</summary>
<br>

# Problem | Deep desires

**Why do we need a tool?**

- _Write DRY code: 1 module, multiple enviorments, multiple resource instances_
- _Write small modules to reduce impact_
- _Use remote state to create logical references to resources_
- _Develop a cross-team, cross-product friendly and consistent workflow_
- _Define a standard repository structure_
- _Reduce human error by avoiding long/complext commands_
- _Establish a predictable naming convention_
- _Write clear documentication with reproducible outcomes_

</details>

[//]:"-----------[Solutions]--------------"

<details>
<summary>Solutions</summary>
<br>

## Solutions

A slightly opinionated folder structure

### Repository top-level:

```
.
|-- .tfm.conf
|-- README.md
|-- terraform/
        |-- enviorments/
        |-- modules/
```

### One folder per root module

```
terraform/modules/
    |-- allocate-network/
    |       |-- main.tf
    |-- create-network/
    |       |-- main.tf
    |-- provision-service/
    |       |-- main.tf
    |-- register-networks/
            |-- main.tf

```

### Allow multiple products (or microservices) to share a repository

```
terraform/enviorments/
    |-- neteng/
    |     |-- company-ip-space/
    |           |-- register-networks/
    |                 |-- cidrs.tfvars
    |-- service-a/
    |    |-- dev/
    |         |-- allocate-network/
    |         |     |-- services.tfvars
    |         |-- create-network/
    |         |     |-- services.tfvars
    |         |-- provision-service/
    |         |     |-- bastion.tfvars
    |         |     |-- salt.tfvars
```

## Folder Structure

### Repository root
- **.tfm.conf**
    - _Customize module/enviorment paths_
- **terraform/modules**
    - _One folder for each root module_
    - _Nested root modules are not supported_
- **terraform/enviorments**
    - _Product folders_
    - _Enviorment/modules/component.tfvars_

## Wrapper interface

</details>

[//]:"-------------[Outcome]-------------"

<details>
<summary>Outcome</summary>
<br>

> Question: 
>> What did we get?

</details>

[//]:"-------------[Demos]---------------"

<details>
<summary>Demos</summary>
<br>

> Description: 
>> See it in action

</details>

[//]:"-----------[Conclusions]-----------"

<details>
<summary>Conclusions</summary>
<br>

> My take

</details>

---

Credit to [Sorin Lacriteanu]() and his awesome [presentation]() and instruction on this topic. 

Other helpful resources:

[//]:"docker"

<details>
<summary>Docker</summary>
<br>

- [Docker-Hub](https://hub.docker.com/)
- [Learn-Docker](https://www.docker.com/101-tutorial/)
- [Docker-Zero-to-Hero](https://www.youtube.com/watch?v=3c-iBn73dDE)

</details>

[//]:"terraform"

<details>
<summary>Terraform</summary>
<br>

- [Organizing-Terraform](https://www.youtube.com/watch?v=-Fm2D7st_F4&t=194)
- [Learn-Terraform](https://learn.hashicorp.com)
- [Hashicorp-LinkedIN](https://linkedin.com/company/Hashicorp)
- [Beginner-to-Pro](https://www.youtube.com/watch?v=7xngnjfIlK4&t=922s)

</details>

[//]:"kubernetese"

<details>
<summary>Kubernetes</summary>
<br>

- [Learn-Kubernetes](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
- [Zero-to-Hero-course](https://www.youtube.com/watch?v=X48VuDVv0do&t=54s)

</details>

[//]:"gcp"

<details>
<summary>Google Cloud Platform</summary>
<br>

- [Learn-GCP](https://cloud.google.com/training)
- [GCP-Masterclass](https://www.youtube.com/watch?v=jpno8FSqpc8)

</details>

[//]:"aws"

<details>
<summary>Amazon Webservice</summary>
<br>

- [Learn-AWS](https://aws.amazon.com/training/)
- [Automate-AWS-with-Terraform](https://www.youtube.com/watch?v=SLB_c_ayRMo&t=7618s)
- [Complete-AWS-Training](https://www.youtube.com/watch?v=3hLmDS179YE)

</details>

[//]:"azure"

<details>
<summary>Microsoft Azure</summary>
<br>

- [Learn-Azure](https://learn.microsoft.com/en-us/training/azure/)
- [Azure-Fundamentals](https://www.youtube.com/watch?v=NKEFWyqJ5XA)

</details>