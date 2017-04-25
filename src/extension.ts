'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs-extra';
import * as path from 'path';
import { Scaffolder, TemplateOptionsData, ScaffoldConfig } from 'scaffs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    let disposable = vscode.commands.registerCommand('extension.scaffold', async fileInfo => {

        const projectPath = vscode.workspace.rootPath;
        const creationPath = getClosestDirectory(fileInfo.fsPath || fileInfo.path);

        if(!creationPath) {
            vscode.window.showErrorMessage('Unable to find target directory.');
            return;
        }

        try {
            let scaffsConfig = await Scaffolder.loadScaffsConfig(projectPath);

            let availableScaffNames: string[] = Object.keys(scaffsConfig.absoluteScaffPaths);

            let scaffoldName = await vscode.window.showQuickPick(availableScaffNames);

            // If the user hits escape or clicks out of the quick pick
            if (!scaffoldName) {
                return;
            }

            let scaffoldConfig = await Scaffolder.loadScaffoldConfig(scaffsConfig, scaffoldName);
            let templateOptions = { data: await getTemplateVariables(scaffoldConfig) }

            await Scaffolder.scaffold(scaffsConfig, scaffoldName, creationPath, templateOptions);
            
        } catch (e) {
            vscode.window.showErrorMessage(e);
        }

    });

    context.subscriptions.push(disposable);
}

/**
 * Prompts user for variables need by the template
 * 
 * @param scaffoldConfig - scaffold config to get variabls for
 */
function getTemplateVariables(scaffoldConfig: ScaffoldConfig): Promise<TemplateOptionsData> {
    return new Promise(async (resolve, reject) => {
        let variables = Scaffolder.getScaffoldVariables(scaffoldConfig);
        let templateData: TemplateOptionsData = {};

        for (let i = 0, len = variables.length; i < len; i++) {
            let variable = variables[i];
            let inputOptions: vscode.InputBoxOptions = {
                prompt: variable.prompt,
                placeHolder: variable.name,
                // validateInput: value => null
            };
            let value = await vscode.window.showInputBox(inputOptions);

            if (!variable.optional && (!value || !value.length)) {
                reject(`${variable.name} is required.`);
                return;
            }

            templateData[variable.name] = value;
        }
        resolve(parseInputData(templateData));
    });
}

/**
 * Gets the closest directory to a provided path. If the provided path is a directory
 * already it will be returned.
 * 
 * @param filePath - path to file to check
 */
function getClosestDirectory(filePath: string): string | null {
    try {
        let isDirectory = fs.statSync(filePath).isDirectory();
        return isDirectory ? filePath : path.resolve(filePath, '..');
    } catch (e) {
        return null;
    }
}

/**
 * Parses the input strings from minimist and returns a parsed object
 *
 * @param data - input data object
 */
function parseInputData(data: any): Object {
    const JSON_STRING_REGEXP = /^[\[|\{].*[\]|\}]$/;
    if (typeof data === 'object') {
        let output: any = Array.isArray(data) ? [] : {};
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                output[key] = parseInputData(data[key]);
            }
        }
        return output;
    } else if (typeof data === 'string' && data.match(JSON_STRING_REGEXP)) {
        try {
            return JSON.parse(data);
        } catch (e) { }
    }
    return data;
}