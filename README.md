# Overview
A JavaScript library for Power Apps portals (previously Microsoft CRM Portals). To write basic functions like show and hide in Power Apps portals, we need to rely on jQuery for extensive manipuliation of DOM. The library provides these functionality in simple, clear and readable syntaxes. The library will help developers who are familar with Power Apps client script.

# Command samples
## Get value of an attribute
```
Xrm.Portal.Form.get(attributename).getValue();
```
## Set value of an attribute
```
Xrm.Portal.Form.get(attributename).setValue(object);
Xrm.Portal.Form.get(attributename).setValue(id, name, entityLogicalName); //For lookup
```
## Show/hide an attribute
```
Xrm.Portal.Form.get(attributename).setVisible(bool);
```
## Disable/enable an attribute
```
Xrm.Portal.Form.get(attributename).setDisable(bool);
```
## Set required of an attribute
```
Xrm.Portal.Form.get(attributename).setRequired(bool); //Default - a default validation and a default message
Xrm.Portal.Form.get(attributename).setRequired(bool, function); //A custom validation and a default message
Xrm.Portal.Form.get(attributename).setRequired(bool, function, message); //A custom validation and a custom message
```
## Attach/Remove OnChange event of an attribute
```
Xrm.Portal.Form.get(attributename).attachOnChange(callback);
Xrm.Portal.Form.get(attributename).removeOnChange();
```
## Method chaining
```
Xrm.Portal.Form.get(attributename).setValue(object).setVisible(bool).setRequired(bool);
```
## Validations
### Regular Expressions
```
Xrm.Portal.Form.Validation.assertRegex(attributename, RegEx, message, [isRequired])
```
### Block past date
```
Xrm.Portal.Form.Validation.denyPastDate(attributename, message, [isRequired])
```

### Block future date
```
Xrm.Portal.Form.Validation.denyFutureDate(attributename, message, [isRequired])
```

### Compare main and sub. Main must be later than sub.
```
Xrm.Portal.Form.Validation.compareDates(mainattributename, subattributename, message, [isRequired])
```

### Set range to number
```
Xrm.Portal.Form.Validation.setNumberRange(attributename, min, max, message, [isRequired])
```

## User
```
Xrm.Portal.User.getAsync() => promise
```

## Transform text fields to canvas
The method transforms a text field into a canvas, allowing users to draw lines or sign. Base64 string of canvas will be set to the underlying text field.
```
Xrm.Portal.Form.get(fieldName).transformToCanvas();
```
