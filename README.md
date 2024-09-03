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

## Requirements

* node - [v20.16.0](https://nodejs.org/en/blog/release/v20.16.0)
* npm - [v10.8.1](https://www.npmjs.com/package/npm/v/10.8.1)

## Official plugins

For now, we don't have many plugins to offer you, but follow us and in the next (few) months you will see new plugins (like Jenkins or Kubernetes).

### Terraform plugin

Plugin to manage terraform files, by default it comes with aws provider definition.

[GitHub url](https://github.com/ditrit/terrator-plugin#0.12.2)

### Github plugin

Plugin to manage GitHub action files.

[GitHub url](https://github.com/ditrit/githubator-plugin#0.5.2)

### Kubernetes plugin

Plugin to manage Kubernetes files.

[GitHub url](https://github.com/ditrit/kubernator-plugin#0.3.2)

## Compatibility versions table

<table>
  <thead>
    <tr>
      <th rowspan="2">Leto-modelizer</th>
      <th colspan="4">Supported version</th>
    </tr>
    <tr>
      <th>Plugin-core</th>
      <th>Terrator-plugin</th>
      <th>Githubator-plugin</th>
      <th>kubernator-plugin</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1.0.0</td>
      <td>= 0.13.0<br>= 0.14.0</br></td>
      <td>= 0.1.12</td>
      <td>🚫</td>
      <td>🚫</td>
    </tr>
    <tr>
      <td>1.1.0</td>
      <td>= 0.15.2</td>
      <td>= 0.2.0</td>
      <td>= 0.1.1</td>
      <td>🚫</td>
    </tr>
    <tr>
      <td>1.2.0</td>
      <td>= 0.16.0</td>
      <td>= 0.3.0</td>
      <td>= 0.2.0</td>
      <td>🚫</td>
    </tr>
    <tr>
      <td>1.3.0</td>
      <td>= 0.21.0</td>
      <td>= 0.7.0</td>
      <td>= 0.2.5</td>
      <td>🚫</td>
    </tr>
    <tr>
      <td>next version</td>
      <td>= 0.28.0</td>
      <td>= 0.12.2</td>
      <td>= 0.5.2</td>
      <td>= 0.3.2</td>
    </tr>
  </tbody>
</table>

## How to install plugin

Run `npm install` to let npm retrieve all dependencies and especially our cli to easily install your plugins 😉.

Then you just have to know two things about your plugins:
- its name
- its version

### Install official plugins

The `leto-modelizer-plugin-cli.json` file, at the root of Leto Modelizer, contains the list of official plugins provided by the team.
Each plugin is represented by an object containing the name, scope and version of the plugin.

To install plugin, run this command `npm run plugin:install`.

![](docs/plugin-install-official.gif)

### Install custom plugin

If you want to add a custom plugin, you can modify `leto-modelizer-plugin-cli.json`:
- if your plugin is referenced on npm:
```js
// leto-modelizer-plugin-cli.json
[
  // (...)
  {
    "displayName": "YOUR_PLUGIN_DISPLAY_NAME",
    "name": "YOUR_PLUGIN_NAME",
    "scope": "NPM_ORGANISATION",
    "version": "X.X.X"
  }
]
```
- if your plugin only have a repository url on a git provider:
```js
// leto-modelizer-plugin-cli.json
[
  // (...)
  {
    "displayName": "YOUR_PLUGIN_DISPLAY_NAME",
    "name": "YOUR_PLUGIN_NAME",
    "scope": "YOUR_ORGANISATION",
    "version": "X.X.X",
    "url": "YOUR_REPOSITORY_URL" // like http(s)://github.com/repository.git#1.0.0
  }
]
```

For more information about configuring plugin, you can read this [documentation](https://github.com/ditrit/leto-modelizer-plugin-cli).

Then execute this command `npm run plugin:install` and choose your custom plugin in the list to install it.

### Install official/custom plugin in command line

Options `name` and `version` can be added with the `npm run plugin:install` command to bypass cli prompts.

```bash
# Example with terraform plugin
npm run plugin:install -- name="terrator-plugin" version="0.12.2"

# Example with github action plugin
npm run plugin:install -- name="githubator-plugin" version="0.5.2"

# Example with kubernator plugin
npm run plugin:install -- name="kubernator-plugin" version="0.3.2"
```

Now that your plugin is installed, you can continue to install other plugins with the same command if you want.

## How to uninstall plugin

Run `npm install` to let npm retrieve all dependencies and especially our cli to easily uninstall your plugins 😉.

Then you just have to know two things about your plugins:
- its name
- its version

### Uninstall plugins

To uninstall plugin, run this command `npm run plugin:uninstall`.

![](docs/plugin-uninstall.gif)
- 
### Uninstall plugin in command line

Options `name` and `version` can be added with the `npm run plugin:uninstall` command to bypass cli prompts.

```bash
# Example with terraform plugin
npm run plugin:uninstall -- name="terrator-plugin" version="0.12.2"

# Example with github action plugin
npm run plugin:uninstall -- name="githubator-plugin" version="0.5.2"

# Example with kubernator plugin
npm run plugin:uninstall -- name="kubernator-plugin" version="0.3.2"
```

Now that your plugin is uninstalled, you can continue to uninstall other plugins with the same command if you want.

## How to setup the authentication with Leto-Modelizer-Api

We are using [Leto-Modelizer-Api](https://github.com/ditrit/leto-modelizer-api) authentication (as a backend). To configure it, you must fill the configuration inside `global.config.json` root file.

We have administration view [Leto-Modelizer-Admin](https://github.com/ditrit/leto-modelizer-admin), for users who have `admin` role, to manage users, groups and roles.

```json
{
  "backendUrl": "https://localhost:8443"
}
```

To get the authentication setup, `backendUrl`is mandatory.

**_NOTE_**: If the previous configuration is not present in the configuration file, Leto-Modelizer will be launched with the backend mode deactivated.
**_NOTE_**: For now, there is no UI associated to the backend, but the UI for the admin is coming soon !
**_NOTE_**: The AI tools are only available with the backend mode and it needs to be authenticated with Leto-Modelizer-Api.

## How to build this app

### Native build

Once you have installed and initialized all your plugins, run this command to build the app:

```
npm run build
```

It will generate the built application in the `dist` folder.

### Docker build

To build this app with docker (the two main plugins for terraform & github are included), please use this command:
```bash
docker build . -build-arg TERRATOR_PLUGIN_VERSION="0.12.2" -build-arg GITHUBATOR_PLUGIN_VERSION="0.5.2" -build-arg KUBERNATOR_PLUGIN_VERSION="0.3.2" -t leto-modelizer
```

### Docker run

Once your image is built, to run the associated container please use this command:
```bash
docker run -p 8080:80 leto-modelizer
```

### Proxy

See [nginx configuration](nginx.conf).

### Environment variables

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

Same for your Leto-Modelizer-Api, you need to set a reverse proxy named `backend`. You can see an example below of an `nginx.conf` file:

```bash
http {
  server {
    listen 1337;
    location /backend {
      proxy_pass YOUR_URL; # replace by your url
    }
  }
}
```

**_NOTE:_** You can use the global configuration file `global.config.json` to define environment variables like so :

```json
{
  "templateLibrary": "YOUR_TEMPLATE_LIBRARY_BASE_URL",
  "backendUrl": "YOUR_URL"
}
```

* Allow to keep `data-cy` attribute in html

`KEEP_CYPRESS_ATTRIBUTE` is used to keep all `data-cy` attribute in the generated html.

```bash
KEEP_CYPRESS_ATTRIBUTE=true npm run build
```
