# Leto Modelizer (leto-modelizer)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer&metric=alert_status)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer)
[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer&metric=reliability_rating)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer&metric=sqale_rating)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer&metric=security_rating)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer)

[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer&metric=code_smells)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer&metric=bugs)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer&metric=vulnerabilities)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer&metric=sqale_index)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer)

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer&metric=ncloc)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer&metric=coverage)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=ditrit_leto-modelizer&metric=duplicated_lines_density)](https://sonarcloud.io/summary/overall?id=ditrit_leto-modelizer)

[![](https://dcbadge.vercel.app/api/server/zkKfj9gj2C?style=flat&theme=default-inverted)](https://discord.gg/zkKfj9gj2C)


Technical topology low-code editing tool.

Leto modelizer is an application that can help you generate infrastructure code without you having to write any code!
One of theirs main qualities is that you can choose:


- which languages you can provide with this application

Or

- Implements your own plugin

Or

- Override existing plugins

If your company take care only of terraform files, you just have to install terraform before build this app and deploy it.

If you only want your own language component (maybe based on existing plugins), you can implement/override existing plugin and just install your plugin definition.

## How to install plugin

Make an `npm install` to let npm retrieve all dependencies and specially our cli to install easily your plugins 😉.

Then you just have to know two things about your plugins:
- it's name
- it's repository url

Let us show you how our cli works with TerraformPlugin:

run this command: `npm run plugin:install`

![](docs/plugin-install.png)

Options `repository-name` and `repository-url` can be added with the `npm run plugin:install` command to bypass cli prompts.

```bash
# Example with terraform plugin
npm run plugin:install -- repository-name="terrator-plugin" repository-url="https://github.com/ditrit/terrator-plugin.git#0.1.12"
```

Now your plugin is installed, you can continue to install other plugins with the same command if you want.

When you have installed all the desired plugins, please run this commands `npm run plugin:init` to complete all plugins' installation.

![](docs/plugin-init.png)

## How to build this app

### Native build

Once you have installed and initialized all your plugins, run this command to build the app:

```
npm run build
```

It will generate the built application in the `dist` folder.

### Docker build

To build this app with docker, please use this command:
```bash
docker build . --build-arg proxy_url=http://localhost:9999 -t leto-modelizer
```

### Proxy

See [nginx configuration](nginx.conf).

### Environment variables

* Define the default path for your models

`MODELS_DEFAULT_FOLDER` is used to define the path of the default folder in which the different plugins and models folders will be located.
By default, the path will be `[root_project]/[plugin]/[model]/[file]`.

For example, if you want the default models folder to be `YOUR_FOLDER`, the path will be `[root_project]/YOUR_FOLDER/[plugin]/[model]/[file]`.
You can also have multiple level by adding a `/` between each name like `YOUR_FOLDER/test/example`. (Warning: Do not add any `/` at the beginning or the end).

To define it :

```bash
MODELS_DEFAULT_FOLDER="YOUR_FOLDER" npm run build
```

* Using templates from a remote repository

`TEMPLATE_LIBRARY_BASE_URL` is used to define the url of a template library you want to use. To have more information on how to build your own template library, please visit [leto-modelizer-templates-library](https://github.com/ditrit/leto-modelizer-templates-library). To define `TEMPLATE_LIBRARY_BASE_URL`, go to your repository, open the `index.json` file (which contains all the metadata of your templates) in raw mode and get the url to the branch name, without including the file name.


```bash
# Example with the leto-modelizer-templates-library repository that contains all default templates for leto-modelizer.
TEMPLATE_LIBRARY_BASE_URL="https://raw.githubusercontent.com/ditrit/leto-modelizer-templates-library/main" npm run build
```

To be able to access external resources for your templates, you need to set a reverse proxy named `template-library`. You can see an example below of an `nginx.conf` file:

```bash
http {
  server {
    listen 80;
    location /template-library {
      proxy_pass TEMPLATE_LIBRARY_BASE_URL; # replace by your url
    }
  }
}
```

* Allow to keep `data-cy` attribute in html

`KEEP_CYPRESS_ATTRIBUTE` is used to keep all `data-cy` attribute in the generated html.

```bash
KEEP_CYPRESS_ATTRIBUTE=true npm run build
```

## Official plugins

For now, we don't have many plugins to offer you, but follow us and in the next (few) months you will see new plugins (like Jenkins or Kubernetes).

### Terraform plugin

Plugin to manage terraform files, by default it comes with aws provider definition.

[GitHub url](https://github.com/ditrit/terrator-plugin)

Option to use it in command `install`:

- plugin name: `terrator-plugin`
- repository url: `https://github.com/ditrit/terrator-plugin.git#0.1.12`

## Compatibility versions table

<table>
  <thead>
    <tr>
      <th rowspan="2">Leto-modelizer</th>
      <th colspan="2">Supported version</th>
    </tr>
    <tr>
      <th>Plugin-core</th>
      <th>Terrator-plugin</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1.0.0</td>
      <td>= 0.13.0</td>
      <td>= 0.1.12</td>
    </tr>
  </tbody>
</table>
