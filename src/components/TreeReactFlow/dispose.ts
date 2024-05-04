/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export interface IDisposable {
  dispose(): void;
}

export function disposeAll(disposables: IDisposable[]) {
  while (disposables.length) {
    const item = disposables.pop();
    if (item) {
      item.dispose();
    }
  }
}

export abstract class Disposable {
  private _isDisposed = false;

  protected _disposables: IDisposable[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public dispose(): any {
    if (this._isDisposed) {
      return;
    }
    this._isDisposed = true;
    disposeAll(this._disposables);
  }

  protected _register<T extends IDisposable>(value: T): T {
    if (this._isDisposed) {
      value.dispose();
    } else {
      this._disposables.push(value);
    }
    return value;
  }

  protected get isDisposed() {
    return this._isDisposed;
  }
}
