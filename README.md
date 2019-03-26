# Overview
A JavaScript library for Microsoft CRM Portals. To write basic functions like show and hide in Microsoft CRM Portals, we need to rely on jQuery for extensive manipuliation of DOM. The library provides these functionality in simple, clear and readable syntaxes. The library will help developers who are familar with Dynamics 365 Client Script.

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
Xrm.Portal.Form.get(attributename).setRequired(bool, function, message); //A custom validation and a custom message
```