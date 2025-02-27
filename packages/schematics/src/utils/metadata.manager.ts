import {
  ArrayLiteralExpression,
  CallExpression,
  createSourceFile,
  Decorator,
  Expression,
  Identifier,
  Node,
  NodeArray,
  ObjectLiteralElement,
  ObjectLiteralExpression,
  PropertyAssignment,
  ScriptTarget,
  SourceFile,
  SyntaxKind,
} from 'typescript';

import { DeclarationOptions } from './module.declarator';

/**
 * The `MetadataManager` class provides utilities for managing metadata entries
 * within a `@Module` decorator in a TypeScript source file. It allows for the
 * insertion of new metadata entries, merging symbols with static options, and
 * handling various scenarios such as empty module decorators or existing metadata
 * properties.
 */
export class MetadataManager {
  constructor(private content: string) {}

  /**
   * Inserts a new metadata entry into the `@Module` decorator.
   *
   * @param metadata - The metadata key to insert.
   * @param symbol - The symbol to insert.
   * @param staticOptions - The static options to insert.
   * @returns The new content string.
   */
  public insert(
    metadata: string,
    symbol: string,
    staticOptions?: DeclarationOptions['staticOptions']
  ): string | undefined {
    const source: SourceFile = createSourceFile(
      'filename.ts',
      this.content,
      ScriptTarget.ES2017
    );
    const moduleDecoratorNode = this.findFirstDecoratorMetadata(
      source,
      'Module'
    );
    // If there is no occurrence of `@Module` decorator, nothing will be inserted
    if (!moduleDecoratorNode) {
      return;
    }
    const matchingProperties: ObjectLiteralElement[] =
      moduleDecoratorNode.properties
        .filter((prop) => prop.kind === SyntaxKind.PropertyAssignment)
        .filter((prop: PropertyAssignment) => {
          const name = prop.name;
          switch (name.kind) {
            case SyntaxKind.Identifier:
              return name.getText(source) === metadata;
            case SyntaxKind.StringLiteral:
              return name.text === metadata;
            default:
              return false;
          }
        });

    symbol = this.mergeSymbolAndExpr(symbol, staticOptions);
    const addBlankLinesIfDynamic = () => {
      symbol = staticOptions ? this.addBlankLines(symbol) : symbol;
    };
    if (matchingProperties.length === 0) {
      const expr = moduleDecoratorNode;
      if (expr.properties.length === 0) {
        addBlankLinesIfDynamic();
        return this.insertMetadataToEmptyModuleDecorator(
          expr,
          metadata,
          symbol
        );
      } else {
        addBlankLinesIfDynamic();
        return this.insertNewMetadataToDecorator(
          expr,
          source,
          metadata,
          symbol
        );
      }
    } else {
      return this.insertSymbolToMetadata(
        source,
        matchingProperties,
        symbol,
        staticOptions
      );
    }
  }

  /**
   * Finds the first `@Module` decorator metadata in the source file.
   *
   * @param source - The source file to search.
   * @param identifier - The identifier to match.
   * @returns The first matching `ObjectLiteralExpression` or undefined.
   */
  private findFirstDecoratorMetadata(
    source: SourceFile,
    identifier: string
  ): ObjectLiteralExpression | undefined {
    for (const node of this.getSourceNodes(source)) {
      const isDecoratorFactoryNode =
        node.kind === SyntaxKind.Decorator &&
        (node as Decorator).expression.kind === SyntaxKind.CallExpression;
      if (!isDecoratorFactoryNode) continue;

      const expr = (node as Decorator).expression as CallExpression;

      const isExpectedExpression =
        expr.arguments[0]?.kind === SyntaxKind.ObjectLiteralExpression;
      if (!isExpectedExpression) continue;

      if (expr.expression.kind === SyntaxKind.Identifier) {
        const escapedText = (expr.expression as Identifier).escapedText;
        const isTargetIdentifier = escapedText
          ? escapedText.toLowerCase() === identifier.toLowerCase()
          : true;
        if (isTargetIdentifier) {
          return expr.arguments[0] as ObjectLiteralExpression;
        }
      }
    }
  }

  /**
   * Returns an array of all nodes in the source file.
   */
  private getSourceNodes(sourceFile: SourceFile): Node[] {
    const nodes: Node[] = [sourceFile];
    const result: Node[] = [];
    while (nodes.length > 0) {
      const node = nodes.shift();
      if (node) {
        result.push(node);
        if (node.getChildCount(sourceFile) >= 0) {
          nodes.unshift(...node.getChildren(sourceFile));
        }
      }
    }
    return result;
  }

  /**
   * Inserts a new metadata entry into an empty `@Module` decorator.
   * This method is called when the `@Module` decorator has no properties.
   * It inserts the metadata and symbol into the decorator.
   * @param expr - The `@Module` decorator node.
   * @param metadata - The metadata key to insert.
   * @param symbol - The symbol to insert.
   * @returns The new content string.
   */
  private insertMetadataToEmptyModuleDecorator(
    expr: ObjectLiteralExpression,
    metadata: string,
    symbol: string
  ): string {
    const position = expr.getEnd() - 1;
    const toInsert = `  ${metadata}: [${symbol}]`;
    return this.content.split('').reduce((content, char, index) => {
      if (index === position) {
        return `${content}\n${toInsert}\n${char}`;
      } else {
        return `${content}${char}`;
      }
    }, '');
  }

  /**
   * Inserts a new symbol into an existing metadata property in the `@Module` decorator.
   * This method is called when the metadata property already exists in the decorator.
   * It inserts the symbol into the existing metadata property.
   * @param source - The source file.
   * @param matchingProperties - The matching metadata properties.
   * @param symbol - The symbol to insert.
   * @param staticOptions - The static options to insert.
   * @returns The new content string.
   */
  private insertNewMetadataToDecorator(
    expr: ObjectLiteralExpression,
    source: SourceFile,
    metadata: string,
    symbol: string
  ): string {
    const node = expr.properties[expr.properties.length - 1];
    const position = node.getEnd();
    const text = node.getFullText(source);
    const matches = text.match(/^\r?\n\s*/);
    let toInsert: string;
    if (matches) {
      toInsert = `,${matches[0]}${metadata}: [${symbol}]`;
    } else {
      toInsert = `, ${metadata}: [${symbol}]`;
    }
    return this.content.split('').reduce((content, char, index) => {
      if (index === position) {
        return `${content}${toInsert}${char}`;
      } else {
        return `${content}${char}`;
      }
    }, '');
  }

  /**
   * Inserts a new symbol into an existing metadata property in the `@Module` decorator.
   * This method is called when the metadata property already exists in the decorator.
   * It inserts the symbol into the existing metadata property.
   * @param source - The source file.
   * @param matchingProperties - The matching metadata properties.
   * @param symbol - The symbol to insert.
   * @param staticOptions - The static options to insert.
   * @returns The new content string.
   */
  private insertSymbolToMetadata(
    source: SourceFile,
    matchingProperties: ObjectLiteralElement[],
    symbol: string,
    staticOptions?: DeclarationOptions['staticOptions']
  ): string {
    const assignment = matchingProperties[0] as PropertyAssignment;
    let node: Node | NodeArray<Expression>;
    const arrLiteral = assignment.initializer as ArrayLiteralExpression;
    if (!arrLiteral.elements) {
      // "imports" is not an array but rather function/constant
      return this.content;
    }
    if (arrLiteral.elements.length === 0) {
      node = arrLiteral;
    } else {
      node = arrLiteral.elements;
    }
    if (Array.isArray(node)) {
      const nodeArray = node as unknown as Node[];
      const symbolsArray = nodeArray.map((childNode) =>
        childNode.getText(source)
      );
      if (symbolsArray.includes(symbol)) {
        return this.content;
      }
      node = node[node.length - 1];
    }
    let toInsert: string;
    let position = (node as Node).getEnd();

    if ((node as Node).kind === SyntaxKind.ArrayLiteralExpression) {
      position--;
      toInsert = staticOptions ? this.addBlankLines(symbol) : `${symbol}`;
    } else {
      const text = (node as Node).getFullText(source);
      const itemSeparator = (text.match(/^\r?\n(\r?)\s+/) ||
        text.match(/^\r?\n/) ||
        ' ')[0];
      toInsert = `,${itemSeparator}${symbol}`;
    }
    return this.content.split('').reduce((content, char, index) => {
      if (index === position) {
        return `${content}${toInsert}${char}`;
      } else {
        return `${content}${char}`;
      }
    }, '');
  }

  /**
   * Merges a symbol with static options into a single string.
   * @param symbol - The symbol to merge.
   * @param staticOptions - The static options to merge.
   * @returns The merged string.
   */
  private mergeSymbolAndExpr(
    symbol: string,
    staticOptions?: DeclarationOptions['staticOptions']
  ): string {
    if (!staticOptions) {
      return symbol;
    }
    const spacing = 6;
    let options = JSON.stringify(staticOptions.value, null, spacing);
    options = options.replace(/"([^(")"]+)":/g, '$1:');
    options = options.replace(/"/g, `'`);
    options = options.slice(0, options.length - 1) + '    }';
    symbol += `.${staticOptions.name}(${options})`;
    return symbol;
  }

  /**
   * Adds blank lines around an expression.
   */
  private addBlankLines(expr: string): string {
    return `\n    ${expr}\n  `;
  }
}
