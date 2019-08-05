declare namespace Xrm {
    var Portal: Portal;
}

interface Portal {
    Form: Form;
    User: User;
}

interface Form {
    Validation: Validation;
    get(attributeName: string): Attribute;
}

interface Attribute {
    attachOnChange(callback: () => any): void;
    getValue(): any;
    removeOnChange(): void;
    setDisable(isDisabled: boolean): void;
    setRequired(isRequired: boolean): void;
    setRequired(isRequired: boolean, customFunction: () => any, customMessage: string): void;
    setValue(value: any): void;
    setValue(value: string, name: string, logicalName: string): void;
    setVisible(isVisible: boolean);
}

interface Validation {
    assertRegex(cid: string, exp: RegExp, message: string, isRequired?: boolean): void;
    compareDates(mainid: string, subid: string, message: string, isRequired?: boolean): void;
    denyFutureDate(cid: string, message: string, isRequired?: boolean): void;
    denyPastDate(cid: string, message: string, isRequired?: boolean): void;
    setNumberRange(cid: string, min: number, max: number, message: string, isRequired?: boolean): void;
}

interface User {
    getAsync(): Promise<object>;
}