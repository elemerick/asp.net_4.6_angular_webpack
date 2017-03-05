Quick start project for ASP.NET Web API 2 based on .NET Framework 4.6 with Angular and webpack.
Prerequisite: install node.js, npm, typesctipt globally npm install -g typescript@2.0.
Prerequisite: Visual Studio 2015 Update 3
Prerequisite: Configure External Web tools
Configure Visual Studio to use the global external web tools instead of the tools that ship with Visual Studio:
	Open the Options dialog with Tools | Options
	In the tree on the left, select Projects and Solutions | External Web Tools.
	On the right, move the $(PATH) entry above the $(DevEnvDir) entries. This tells Visual Studio to use the external tools (such as npm) found in the global path before using its own version of the external tools.
	Click OK to close the dialog.
	Restart Visual Studio for this change to take effect.
Prerequisite: install Typescript 2.2 https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.TypeScript22forVisualStudio2015
	
If you want disable "npm install" every time you open the project then turn off all entries in External Web Tools.


Disable compilation in IDE upon saving set  for a given tsconfig.json 
"compileOnSave": false


If you would like to disable building TypeScript files in your solution add node
<TypeScriptCompileBlocked>true</TypeScriptCompileBlocked>
to the first
<PropertyGroup>
element in .csproj file.


To integration webpack builds with Studio building process use  NPM Task Runner
https://marketplace.visualstudio.com/items?itemName=MadsKristensen.NPMTaskRunner


Or you can use WebPack Task Runner
https://marketplace.visualstudio.com/items?itemName=MadsKristensen.WebPackTaskRunner


Custom button, which will toggle Webpack's watch mode on and off https://github.com/webpack/docs/wiki/Usage-with-Visual-Studio

Useful extensions:

You can use https://marketplace.visualstudio.com/items?itemName=MadsKristensen.WebAnalyzer for tslint.

Allow you to copy C# source code, then paste as Typescript syntax which help you with converting DTO or interface.  
https://marketplace.visualstudio.com/items?itemName=NhaBuiDuc.TypescriptSyntaxPaste