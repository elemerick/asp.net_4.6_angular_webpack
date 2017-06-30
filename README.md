# Quick start project for ASP.NET Web API 2 based on .NET Framework 4.6 with Angular including Webpack, JWT authentication, SignalR with authentication.
Prerequisite: install node.js, install TypeScript globally:
                          
    npm install -g typescript

Prerequisite: Visual Studio 2015 Update 3 or Visual Studio 2017

Prerequisite: Configure Visual Studio to use the global external web tools instead of the tools that ship with Visual Studio:
  - Open the Options dialog with Tools | Options
  - In the tree on the left, select Projects and Solutions | External Web Tools.
  - On the right, move the $(PATH) entry above the $(DevEnvDir) entries. This tells Visual Studio to use the external tools (such as npm) found in the global path before using its own version of the external tools.
  - Click OK to close the dialog.
  - Restart Visual Studio for this change to take effect.
  
To disable compilation of ts files in IDE upon saving set for a given tsconfig.json "compileOnSave": false

If you want to disable "npm install" every time you open the project then turn off all entries in External Web Tools.

If you would like to disable building TypeScript files by IDE Build in your solution add node
```sh
<TypeScriptCompileBlocked>true</TypeScriptCompileBlocked>
```
to the first PropertyGroup element in .csproj file.

# Building Angular:
First install all npm packages:

    npm install

Build your Angular app by npm scripts commands:


| npm script | comment |
| ------ | ------ |
| npm run build  | build Angular app without AOT |
| npm run build:prod | build Angular app for production with AOT and minimization |
| npm run wp  | build Angular app in watch mode without AOT |
| npm run wp:aot | build Angular app with AOT but not in production mode |
| npm run clean | clean output webpack folder |
| npm run reset  | clean everything including node_modules |
| npm run tslint  | inting Angular app |
| npm run test  | testing Angular app by karma and jasmine |
| npm run e2e  | e2e testing Angular app by protractor |
| npm run srcmap  | investigate resulting webpack chunck, change for correct filename |


All routes redirected to Angular app except for /api , /oauth , /signalr uri. If you want to add routes to WebApi, then add corresponding line in Web.config rule named "Angular routes", e.g. 
```sh
<add input="{REQUEST_URI}" pattern="^/(api)" negate="true"/>
```
 
 Project support angular-cli generation, testing and linting. 

 Go to ./src/app folder and run for example  

    ng generate component test  


 It require to install angular-cli globally:
 
    npm install -g @angular/cli


# Authentication

This application use JWT authentication.  Call /oauth/token endpoint for authentication. 

Add to the project root folder keys.config file with secret key for signing tokens. **Don't include it to the source control**. Example:
```sh
<appSettings>
  <add key="issuer" value="http://localhost:62422/"/>
  <add key="secret" value="IxrAjDoa2FqElO7IhrSrUJELhUckePEPVpaePlS_Xaw"/>
  <add key="as:AudienceId" value="414e1927a3884f68abc79f7283837fd1" />
</appSettings>
```

This application use basic realization of Identity framework without EntityFrameowork or any other real DB. You can change working logic with DB in CustomUserManager and CustomUserStore classes. 

Use BCrypt for password hashing in BCryptPasswordHasher class.

# Useful extensions:

For integration webpack builds with Studio building process use [NPM Task Runner](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.NPMTaskRunner)

Or [WebPack Task Runner](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.WebPackTaskRunner)

There is example of custom button, which will toggle Webpack's watch mode on and off in Visual Studio 2015 [link](https://github.com/webpack/docs/wiki/Usage-with-Visual-Studio)

You can use [WebAnalyzer](https://marketplace.visualstudio.com/items?itemName=MadsKristensen.WebAnalyzer) for tslint.

This extension allow you to copy C# source code, then paste as Typescript syntax which help you with converting DTO or interface [TypescriptSyntaxPaste](https://marketplace.visualstudio.com/items?itemName=NhaBuiDuc.TypescriptSyntaxPaste)
