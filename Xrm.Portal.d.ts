declare namespace Xrm {
    /**
     * The Portal.
     */
    var Portal: Portal;
}

interface Portal {
    /**
     * The Form.
     */
    Form: Form;

    /**
     * The User.
     */
    User: User;
}

interface Form {
    /**
     * Validation functions.
     */
    Validation: Validation;

    /**
     * Returns the attribute.
     * @param attributeName The attribute name.
     */
    get(attributeName: string): Attribute;
}

interface Attribute {
    /**
     * Attachs an OnChange event to an attribute.
     * @param callback The callback function.
     */
    attachOnChange(callback: () => any): void;

    /**
     * Returns the value of an attribute.
     */
    getValue(): any;

    /**
     * Removes an OnChange event from an attribute.
     */
    removeOnChange(): void;

    /**
     * Disables or enables an attribute.
     * @param isDisabled Disable the attribute?
     */
    setDisable(isDisabled: boolean): void;

    /**
     * Sets the required level of an attribute with default validation and message.
     * @param isRequired Make the attribute required?
     */
    setRequired(isRequired: boolean): void;

    /**
     * Sets the required level of an attribute with custom validation and custom message.
     * @param isRequired Make the attribute required?
     * @param customFunction The custom validation function.
     * @param customMessage The custom message.
     */
    setRequired(isRequired: boolean, customFunction: () => any, customMessage: string): void;

    /**
     * Sets the value of an attribute.
     * @param value The attribute value.
     */
    setValue(value: any): void;

    /**
     * Sets the value of a lookup attribute.
     * @param id The GUID.
     * @param name The name.
     * @param logicalName The entity logical name.
     */
    setValue(id: string, name: string, logicalName: string): void;

    /**
     * Sets the visibility of an attribute.
     * @param isVisible Make attribute visible?
     */
    setVisible(isVisible: boolean): void;
}

interface Validation {
    /**
     * Performs RegEx validation.
     * @param cid The attribute name.
     * @param exp The RegEx expression.
     * @param message The message.
     * @param isRequired Attribute required?
     */
    assertRegex(cid: string, exp: RegExp, message: string, isRequired?: boolean): void;

    /**
     * Compares two date attributes.
     * @param mainid The main attribute name.
     * @param subid The sub attribute name.
     * @param message The message.
     * @param isRequired Attribute required? 
     */
    compareDates(mainid: string, subid: string, message: string, isRequired?: boolean): void;

    /**
     * Blocks future dates from a date attribute.
     * @param cid The attribute name.
     * @param message The message.
     * @param isRequired Attribute required?
     */
    denyFutureDate(cid: string, message: string, isRequired?: boolean): void;

    /**
     * Blocks past dates from a date attribute.
     * @param cid The attribute name.
     * @param message The message.
     * @param isRequired Attribute required?
     */
    denyPastDate(cid: string, message: string, isRequired?: boolean): void;

    /**
     * Sets the valid number range of a number attribute.
     * @param cid The attribute name.
     * @param min The minimum value.
     * @param max The maximum value.
     * @param message The message.
     * @param isRequired Attribute required?
     */
    setNumberRange(cid: string, min: number, max: number, message: string, isRequired?: boolean): void;
}

interface User {
    /**
     * Returns the user.
     */
    getAsync(): Promise<object>;
}