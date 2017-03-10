# Quick start project for ASP.NET Web API 2 based on .NET Framework 4.6 with Angular and Webpack 2.
Prerequisite: install node.js, typesctipt globally: npm install -g typescript@2.0
Prerequisite: Visual Studio 2015 Update 3 or Visual Studio 2017
Prerequisite: Configure Visual Studio to use the global external web tools instead of the tools that ship with Visual Studio:
  - Open the Options dialog with Tools | Options
  - In the tree on the left, select Projects and Solutions | External Web Tools.
  - On the right, move the $(PATH) entry above the $(DevEnvDir) entries. This tells Visual Studio to use the external tools (such as npm) found in the global path before using its own version of the external tools.
  - Click OK to close the dialog.
  - Restart Visual Studio for this change to take effect.
  
If you want disable "npm install" every time you open the project then turn off all entries in External Web Tools.

To disable compilation in IDE upon saving set  for a given tsconfig.json "compileOnSave": false

If you would like to disable building TypeScript files in your solution add node
<TypeScriptCompileBlocked>true</TypeScriptCompileBlocked>
to the first
<PropertyGroup>
element in .csproj file.

# Building Angular:
You can build your Angular app by npm scripts commands:
  - npm run build (build Angular app without AOT and minimization with sourcemaps)
  - npm run build:prod  (build Angular app for production with AOT and minimization)
  - npm run wp (build Angular app in watch mode without AOT)
  - npm run clean (clean folder with output of webpack)
  - npm run tslint (linting Angular app)
  - npm run test (testing Angular app by karma and jasmine)
  - npm run e2e ( e2e testing Angular app by protractor)
  - npm run srcmap (you can investigate resulting webpack chuncks, don't forget to change for correct filename)

# Useful extensions:

For integration webpack builds with Studio building process use  NPM Task Runner https://marketplace.visualstudio.com/items?itemName=MadsKristensen.NPMTaskRunner

or you can use WebPack Task Runner https://marketplace.visualstudio.com/items?itemName=MadsKristensen.WebPackTaskRunner

Also you can use this custom button, which will toggle Webpack's watch mode on and off in Visual Studio 2015 https://github.com/webpack/docs/wiki/Usage-with-Visual-Studio

You can use https://marketplace.visualstudio.com/items?itemName=MadsKristensen.WebAnalyzer for tslint.

Allow you to copy C# source code, then paste as Typescript syntax which help you with converting DTO or interface.  
https://marketplace.visualstudio.com/items?itemName=NhaBuiDuc.TypescriptSyntaxPaste
