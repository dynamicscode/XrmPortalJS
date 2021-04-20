var Xrm = Xrm || {};

Xrm.Portal = {
  // User: {
  //     getAsync: async function() {
  //         var t = await Xrm.Portal.Utility.Auth.get();
  //         return (Xrm.Portal.Utility.Auth.decode(t));
  //     }
  // },
  Utility: {
    Auth: {
      /*authorize: function() {
      },*/
      decode: function(token) {
        if (token !== "") {
          var base64Url = token.split('.')[1];
          var base64 = decodeURIComponent(atob(base64Url).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join(''));

          return JSON.parse(base64);
        }
        throw "No login user is detected.";
      },
      get: function() {
        return $.get("/_services/auth/token");
      }
    },
    hasPage_Validators: function() {
      return typeof(Page_Validators) !== typeof(undefined);
    },
    Selector: {
      appendSelector: function(id) {
        return "#" + id;
      },
      appendLabel: function(id) {
        return id + "_label";
      },
      getByControlId: function(id) {
        return $(this.appendSelector(id));
      },
      getTextLabel: function(id) {
        return $(this.appendSelector(id) + "_label");
      },
      getLookupName: function(id) {
        return $(this.appendSelector(id) + "_name");
      },
      getLookupEntity: function(id) {
        return $(this.appendSelector(id) + "_entityname");
      },
      getByDataName: function(id) {
        return $("[data-name=" + id + "]");
      }
    },
    Validation: {
      postFix: "_Xrm_Client_Validation",
      required: function(control) {
        console.log("Validation.required -> id: " + control);
        var value = control.getValue();
        if (value == null || value == "" || (value.hasOwnProperty("id") && (value.id == "" || value.id == null))) {
          return false;
        } else {
          return true;
        }
      },
      removeValidation: function(groupObj, control) {
        $(groupObj).attr("class", "info");
        var l = Xrm.Portal.Utility.Selector.appendLabel(control.id);
        var vid = l + this.postFix;
        if (Xrm.Portal.Utility.hasPage_Validators()) {
          Page_Validators = $.grep(Page_Validators,
            function(e) {
              return $(e).prop('controltovalidate') != "" && $(e).prop('id') != vid;
            }
          );
        }
      },
      setValidation: function(groupObj, control, isRequired, validationGroup, validationFunction, customMessage) {
        var id = control.id;
        var l = Xrm.Portal.Utility.Selector.appendLabel(id);
        var vid = l + this.postFix;
        var g = groupObj;
        var c = Xrm.Portal.Utility.Selector.getByControlId(id);
        if (c.length > 0) {
          isRequired && $(g).attr("class", "info required");
          if (Xrm.Portal.Utility.hasPage_Validators()) {
            Page_Validators = $.grep(Page_Validators,
              function(e) {
                return $(e).prop('controltovalidate') != "" && $(e).prop('id') != vid;
              }
            );

            validationGroup = (validationGroup == null || validationGroup == "") && Page_Validators.length > 0 ? Page_Validators[0].validationGroup : validationGroup;

            var vF = validationFunction == null && isRequired ? function() {
              return Xrm.Portal.Utility.Validation.required(control)
            } : validationFunction;

            //retrive lable if there is no custom message
            var m = customMessage == null ? $(g).children("label").html() + " is a required field." : customMessage;
            // Create new validator
            var nv = document.createElement('span');
            nv.style.display = "none";
            nv.id = vid;
            nv.controltovalidate = id;
            nv.errormessage = "<a href='#" + l + "'>" + m + "</a>";
            nv.validationGroup = validationGroup;
            nv.initialvalue = "";
            nv.evaluationfunction = vF;

            // Add the new validator to the page validators array:
            Page_Validators.push(nv);

            // Wire-up the click event handler of the validation summary link
            $("a[href='#" + l + "']").on("click", function() {
              scrollToAndFocus("'" + l + "'", "'" + id + "'");
            });
          }
        }
      },
    },
    Event: {
      wireUp: function(events) {
        console.log("Event.wireUp -> events: " + events);
        for (var i in events) {
          var e = events[i];
          if (e.hasOwnProperty("t") && e.hasOwnProperty("f")) {
            console.log("Event wireup -> c: " + e.c + ", t: " + e.t + ", f: " + e.f);
            var c = Xrm.Portal.Utility.Selector.getByControlId(e.c); //CHECK
            switch (e.t) {
              case Xrm.Portal.EventType.OnChange:
                this.attachOnChange(c, e.f);
                break;
              case Xrm.Portal.EventType.OnClick:
                alert("OnClick is not implemented");
                break;
              default:
                break;
            }
          }
        }
      },
      attachOnLoaded: function(control, callback) {
        control.on('loaded', callback);
      },
      attachOnLoad: function(control, callback) {
        control.on('load', callback);
      },
      attachOnChange: function(control, callback, triggerOnLoad) {
        control.change(callback);
        if (triggerOnLoad != false)
          control.trigger('change');
      },
      attachDateTimePickerOnChange: function(control, callback) {
        control.next().datetimepicker().on('dp.change', callback);
      },
      removeOnChange: function(control) {
        control.off('change');
      }
    },
    AdaptiveCard: {
      parseTemplate: function(card, data) {
        var str = JSON.stringify(card);
        var matches = str.match(/(\\)?"\$\{.+?\}(\\)?"/gm)
        if (matches != null) {
          for (var m = 0; m < matches.length; m++) {
            var r = matches[m].match(/[^"${]*(?=})/s);
            if (r != null && r.length > 0) {
              str = str.replace(matches[m], '"' + data[r[0]].replaceAll('"', '\\"') + '"');
            }
          }
          matches = str.match(/("(false|true)(.+)\\""(?=,))|("(false|true)(.+)\\""(?=}))/gm);
          if (matches != null)
            for (var i = 0; i < matches.length; i++) {
              str = str.replace(matches[i], '"' + eval(eval(matches[i])) + '"');
            }
        }
        return JSON.parse(str);
      }
    }
  },
  Ui: {
    get: function(id) {
      var c = Xrm.Portal.Utility.Selector.getByDataName(id);
      var ct = this.getControlType(c);
    },
    getControlType: function(c) {
      console.log("getControlType -> c: " + c);
      if (c.length > 0) {
        if (c.attr("class").startsWith("tab")) {
          return this.controlType.Tab;
        } else if (c.attr("class").startsWith("section")) {
          return this.controlType.Section;
        }
      }
    },
    controlType: {
      Tab: 1,
      Section: 2
    }
  },
  WebForm: {
    isExisted: function() {
      return $('#WebFormPanel').children('.form-readonly').length > 0;
    },
    isReadOnly: function() {
      return Xrm.Portal.WebForm.isExisted() && $('#WebFormPanel').children('.form-readonly').length > 0;
    }
  },
  Form: {
    Validation: {
      assertRegex: function(cid, exp, message, isRequired) {
        Xrm.Portal.Form.get(cid).setRequired(isRequired, function() {
          if (!isRequired && Xrm.Portal.Form.get(cid).getValue() == "") return true;
          else return exp.test(Xrm.Portal.Form.get(cid).getValue());
        }, message);
      },
      denyPastDate: function(cid, message, isRequired) {
        Xrm.Portal.Form.get(cid).setRequired(isRequired, function() {
          if (!isRequired && Xrm.Portal.Form.get(cid).getValue() == "") return true;
          else return new Date() <= new Date(Xrm.Portal.Form.get(cid).getValue());
        }, message);
      },
      denyFutureDate: function(cid, message, isRequired) {
        Xrm.Portal.Form.get(cid).setRequired(isRequired, function() {
          if (!isRequired && Xrm.Portal.Form.get(cid).getValue() == "") return true;
          else return new Date() >= new Date(Xrm.Portal.Form.get(cid).getValue());
        }, message);
      },
      compareDates: function(mainid, subid, message, isRequired) {
        Xrm.Portal.Form.get(mainid).setRequired(isRequired, function() {
          if (!isRequired && Xrm.Portal.Form.get(mainid).getValue() == "") return true;
          else return new Date(Xrm.Portal.Form.get(mainid).getValue()) > new Date(Xrm.Portal.Form.get(subid).getValue())
        }, message);
      },
      setNumberRange: function(cid, min, max, message, isRequired) {
        Xrm.Portal.Form.get(cid).setRequired(isRequired, function() {
          var isMin = true,
            isMax = true;
          if (min != undefined) {
            isMin = Xrm.Portal.Form.get(cid).getValue() >= min;
          }
          if (max != undefined) {
            isMax = Xrm.Portal.Form.get(cid).getValue() <= max;
          }
          if (!isRequired && Xrm.Portal.Form.get(cid).getValue() == "") return true;
          else return isMin && isMax;
        }, message);
      }
    },
    get: function(id) {
      var c = Xrm.Portal.Utility.Selector.getByControlId(id);
      var ct, v;

      if (c != undefined && c.length > 0) {
        ct = this.getControlType(c);
      } else {
        c = Xrm.Portal.Utility.Selector.getByDataName(id);
        ct = this.getUiControlType(c);
      }

      switch (ct) {
        case this.controlType.DatetimePicker:
          v = new Xrm.Portal.Control.DatetimePicker(c);
          break;
        case this.controlType.Radio:
          v = new Xrm.Portal.Control.Radio(c);
          break;
        case this.controlType.Checkbox:
          v = new Xrm.Portal.Control.Checkbox(c);
          break;
        case this.controlType.Lookup:
          v = new Xrm.Portal.Control.Lookup(c);
          break;
        case this.controlType.Tab:
          v = new Xrm.Portal.Control.Tab(c);
          break;
        case this.controlType.Section:
          v = new Xrm.Portal.Control.Section(c);
          break;
        case this.controlType.Subgrid:
          v = new Xrm.Portal.Control.Subgrid(c);
          break;
        case this.controlType.QuickView:
          v = new Xrm.Portal.Control.QuickView(c);
          break;
        case this.controlType.Notes:
          v = new Xrm.Portal.Control.Notes(c);
          break;
        default:
          v = new Xrm.Portal.Control.Generic(c);
          break;
      }
      return v;
    },
    getUiControlType: function(c) {
      console.log("getUiControlType: -> c: " + c);
      if (c.length > 0) {
        if (c.attr("class").startsWith("tab")) {
          return this.controlType.Tab;
        } else if (c.attr("class").startsWith("section")) {
          return this.controlType.Section;
        }
      }
    },
    getControlType: function(c) {
      console.log("getControlType -> c: " + c);
      if (c.length > 0) {
        if (c.attr("data-ui") == "datetimepicker") {
          return this.controlType.DatetimePicker;
        } else if (c.attr("type") == "checkbox") {
          return this.controlType.Checkbox;
        } else if (c.attr("type") == "hidden") {
          return this.controlType.Lookup;
        } else if (c.attr("class") != null && (c.attr("class").indexOf("boolean-radio") >= 0 || c.attr("class").indexOf("picklist horizontal") >= 0 || c.attr("class").indexOf("picklist vertical") >= 0)) {
          return this.controlType.Radio;
        } else if (c.prop('className') == 'subgrid') {
          return this.controlType.Subgrid;
        } else if (c.is('iframe')) {
          return this.controlType.QuickView;
        } else if (c.children('.entity-notes').length > 0) {
          return this.controlType.Notes;
        } else {
          return this.controlType.Control;
        }
      }
    },
    controlType: {
      Control: 1,
      Lookup: 2,
      DatetimePicker: 3,
      Radio: 4,
      Checkbox: 5,
      Tab: 100,
      Section: 101,
      Subgrid: 1000,
      QuickView: 2000,
      Notes: 3000
    }
  },
  Control: {
    Tab: function(c) {
      this.s = Xrm.Portal.Utility.Selector;
      this.id = $(c).prop("id");

      this.c = c;

      this.getValue = function() {
        throw "not implemented";
      };
      this.setValue = function(value) {
        throw "not implemented";
      };
      this.setVisible = function(isVisible, isMandatory) {
        var h = this.c.prev();
        //this.setRequired(isVisible && isMandatory);
        if (isVisible) {
          this.c.show();
          if (h.is('h2')) h.show();
        } else {
          this.c.hide();
          if (h.is('h2')) h.hide();
        }
      };
      this.setDisable = function(isDisabled) {
        throw "not implemented";
      };
      this.setRequired = function(isRequired, customFunction, customMessage) {
        throw "not implemented";
        c.children().each(function() {
          Xrm.Portal.Form.get(this.id).setRequired(isRequired, customFunction, customMessage);
        });
      };
    },
    Section: function(c) {
      this.s = Xrm.Portal.Utility.Selector;
      this.id = $(c).prop("id");

      this.c = c;

      this.getValue = function() {
        throw "not implemented";
      };
      this.setValue = function(value) {
        throw "not implemented";
      };
      this.setVisible = function(isVisible, isMandatory) {
        var g = this.c;
        //this.setRequired(isVisible && isMandatory);
        isVisible ? g.parent().show() : g.parent().hide();
      };
      this.setDisable = function(isDisabled) {
        throw "not implemented";
      };
      this.setRequired = function(isRequired, customFunction, customMessage) {
        throw "not implemented";
        c.children().each(function() {
          Xrm.Portal.Form.get(this.id).setRequired(isRequired, customFunction, customMessage);
        });
      };
    },
    Notes: function(c) {
      this.s = Xrm.Portal.Utility.Selector;
      this.id = $(c).prop("id");

      this.cc = document.getElementById(this.id + '_cc');
      this.c = c;
      this.vg = "";

      this.getValue = function() {
        throw 'not implemented';
      };
      this.setValue = function(value) {
        throw 'not implemented';
      };
      this.getNumberofAttachments = function() {
        return this.c.find('.notes').children().length;
      };
      this.hasAttachments = function() {
        return this.c.find('.notes-empty').css('display') != 'block';
      };
      this.getCurrentPage = function() {
        throw 'not implemented';
      };
      this.setVisible = function(isVisible, isMandatory) {
        var g = this.c.parent().parent();
        //this.setRequired(isMandatory);
        isVisible ? g.show() : g.hide();
        return this;
      };
      this.setCreateVisible = function(isVisible) {
        //this.c.find('a[title=Create]').css('display', isVisible ? '' : 'none');
      };
      this.setDisable = function(isDisabled) {
        //throw "not implemented";
      };
      this.setRequired = function(isRequired, customFunction, customMessage) {
        // var g = c.parent().siblings(".info");
        // isRequired || customFunction != undefined ?
        //   Xrm.Portal.Utility.Validation.setValidation(g, this, isRequired, this.vg, customFunction, customMessage) :
        //   Xrm.Portal.Utility.Validation.removeValidation(g, this);
        // return this;
        throw 'not implemented';
      };
      this.attachOnChange = function(callback) {
        throw 'not implemented';
      };
      this.removeOnChange = function() {
        throw "not implemented";
      };
      this.setValidationGroup = function(g) {
        this.vg = g;
        return this;
      };
    },
    Subgrid: function(c) {
      this.s = Xrm.Portal.Utility.Selector;
      this.id = $(c).prop("id");

      this.cc = document.getElementById(this.id + '_cc');
      this.c = c;
      this.vg = "";

      this.getValue = function() {
        throw "not implemented";
      };
      this.setValue = function(value) {
        throw "not implemented";
      };
      this.getRowCountFromCurrentPage = function() {
        return this.c.find('div > div.view-grid > table > tbody > tr').length;
      };
      this.getCurrentPage = function() {
        throw 'not implemented';
      };
      this.setVisible = function(isVisible, isMandatory) {
        var g = this.c.parent().parent();
        this.setRequired(isMandatory);
        isVisible ? g.show() : g.hide();
        return this;
      };
      this.setCreateVisible = function(isVisible) {
        this.c.find('a[title=Create]').css('display', isVisible ? '' : 'none');
      };
      this.setDisable = function(isDisabled) {
        throw "not implemented";
      };
      this.setRequired = function(isRequired, customFunction, customMessage) {
        var g = c.parent().siblings(".info");
        isRequired || customFunction != undefined ?
          Xrm.Portal.Utility.Validation.setValidation(g, this, isRequired, this.vg, customFunction, customMessage) :
          Xrm.Portal.Utility.Validation.removeValidation(g, this);
        return this;
      };
      this.attachOnChange = function(callback) {
        Xrm.Portal.Utility.Event.attachOnLoaded(this.c, callback);
        return this;
      };
      this.removeOnChange = function() {
        throw "not implemented";
      };
      this.setValidationGroup = function(g) {
        this.vg = g;
        return this;
      };
    },
    QuickView: function(c) {
      this.s = Xrm.Portal.Utility.Selector;
      this.id = $(c).prop("id");

      this.cc = document.getElementById(this.id + '_cc');
      this.c = c;
      this.vg = "";

      this.getValue = function() {
        var values = this.c.contents().find('.form-control');
        var allowFormats = ['DD/MM/YYYY', 'YYYY/MM/DD'];;
        var data = {},
          aName = '';
        for (var i = 0; i < values.length; i++) {
          aName = values[i].id;
          if ($(values[i]).prop('className').indexOf('lookup') > -1) {
            aName = aName.substr(0, aName.lastIndexOf('_name'));
            data[aName] = values[i].value;
          } else if ($(values[i]).prop('id').indexOf('_datepicker_description') > -1 || $(values[i]).prop('className').indexOf('datetime') > -1) {
            aName = aName.replace('_datepicker_description', '');
            data[aName] = "";
            if (values[i].value != null && values[i].value != "") {
              data[aName] = moment(values[i].value, allowFormats).toDate().toString('dd/MM/yyyy');
            }
          } else if ($(values[i]).prop('className').indexOf('picklist') > -1) {
            data[aName + "_text"] = $(values[i]).find('option:selected').text();
            data[aName] = $(values[i]).find('option:selected').val();
          } else {
            data[aName] = values[i].value;
          }
        }
        return data;
      };
      this.setValue = function(value) {
        throw "not implemented";
      };
      this.setVisible = function(isVisible, isMandatory) {
        var g = this.c.parent().parent();
        //this.setRequired(isMandatory);
        isVisible ? g.show() : g.hide();
        return this;
      };
      this.setDisable = function(isDisabled) {
        throw 'not implemented';
      };
      this.setRequired = function(isRequired, customFunction, customMessage) {
        throw 'not implemented'
      };
      this.attachOnChange = function(callback) {
        Xrm.Portal.Utility.Event.attachOnLoad(this.c, callback);
        return this;
      };
      this.removeOnChange = function() {
        throw "not implemented";
      };
      this.setValidationGroup = function(g) {
        throw 'not implemented'
      };
      this.renderAdaptiveCard = function(attribute, card, data) {
        Xrm.Portal.Form.get(attribute).cL.parent().next().next().remove();
        if (Xrm.Portal.Form.get(attribute).getValue().id != "") {
          var parsedCard = Xrm.Portal.Utility.AdaptiveCard.parseTemplate(card, data);
          var adaptiveCard = new AdaptiveCards.AdaptiveCard();
          adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
            fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
          });

          adaptiveCard.parse(parsedCard);
          var renderedCard = adaptiveCard.render();

          Xrm.Portal.Form.get(attribute).cL.parent().parent().append(renderedCard);
          return renderedCard;
        }
      }
    },
    Generic: function(c) {
      this.s = Xrm.Portal.Utility.Selector;
      this.id = $(c).prop("id");

      this.cc = document.getElementById(this.id + '_cc');
      this.c = c;
      this.vg = "";

      this.getValue = function() {
        return this.c.val();
      };
      this.setValue = function(value) {
        this.c.val(value);
        if (this.cc != null) this.cc.updateView();
        return this;
      };
      this.setVisible = function(isVisible, isMandatory) {
        var g = this.c.parent().parent();
        this.setRequired(isMandatory);
        isVisible ? g.show() : g.hide();
        return this;
      };
      this.setDisable = function(isDisabled) {
        this.c.prop('disabled', isDisabled);
        return this;
      };
      this.setRequired = function(isRequired, customFunction, customMessage) {
        var g = c.parent().siblings(".info");
        isRequired || customFunction != undefined ?
          Xrm.Portal.Utility.Validation.setValidation(g, this, isRequired, this.vg, customFunction, customMessage) :
          Xrm.Portal.Utility.Validation.removeValidation(g, this);
        return this;
      };
      this.attachOnChange = function(callback, triggerOnLoad) {
        Xrm.Portal.Utility.Event.attachOnChange(this.c, callback, triggerOnLoad);
        return this;
      };
      this.removeOnChange = function() {
        Xrm.Portal.Utility.Event.removeOnChange(this.c);
        return this;
      };
      this.setValidationGroup = function(g) {
        this.vg = g;
        return this;
      };
      this.transformToCanvas = function() {
        this.c.hide();
        if (this.c.parent().children().last()[0].tagName !== "CANVAS") {
          var canvasId = this.id + "Canvas";
          this.c.parent().append("<canvas id=" + canvasId + "></canvas>");
          Xrm.Portal.Control.Canvas(this.id);
        }
      }
    },
    Lookup: function(c) {
      this.s = Xrm.Portal.Utility.Selector;
      this.id = $(c).prop("id");

      this.cL = c;
      this.cN = this.s.getLookupName(this.id);
      this.cE = this.s.getLookupEntity(this.id);
      this.vg = "";

      this.enableOneClick = function() {
        this.cN.on('click', () => this.cL.siblings('div.input-group-btn').children('button.launchentitylookup').click());
      };
      this.getValue = function() {
        return {
          "id": this.cL.val(),
          "name": this.cN.val(),
          "logicalname": this.cE.val()
        };
      };
      this.setValue = function(value, name, logicalName) {
        if (value != null && value.hasOwnProperty('id') && value.hasOwnProperty('name') && value.hasOwnProperty('logicalname')) {
          this.cL.val(value.id);
          this.cN.val(value.name);
          this.cE.val(value.logicalname);
        } else {
          this.cL.val(value);
          this.cN.val(name);
          this.cE.val(logicalName);
        }
        return this;
      };
      this.setVisible = function(isVisible, isMandatory) {
        this.setRequired(isMandatory);
        var g = this.cL.parent().parent().parent();
        isVisible ? g.show() : g.hide();
        return this;
      };
      this.setDisable = function(isDisabled) {
        this.cN.prop('disabled', isDisabled);
        this.cN.siblings('div.input-group-btn').toggle(!isDisabled);
        return this;
      };
      this.setRequired = function(isRequired, customFunction, customMessage) {
        var g = this.cL.parent().parent().siblings(".info");
        isRequired || customFunction != undefined ?
          Xrm.Portal.Utility.Validation.setValidation(g, this, isRequired, this.vg, customFunction, customMessage) :
          Xrm.Portal.Utility.Validation.removeValidation(g, this);
        return this;
      };
      this.attachOnChange = function(callback) {
        Xrm.Portal.Utility.Event.attachOnChange(this.cL, callback);
        return this;
      };
      this.removeOnChange = function() {
        Xrm.Portal.Utility.Event.removeOnChange(this.cL);
        return this;
      };
      this.setValidationGroup = function(g) {
        this.vg = g;
        return this;
      };
    },
    Checkbox: function(c) {
      this.s = Xrm.Portal.Utility.Selector;
      this.id = $(c).prop("id");

      this.c = c;
      this.vg = "";

      this.getValue = function() {
        return this.c.prop("checked");
      };
      this.setValue = function(value) {
        this.c.prop("checked", value);
        return this;
      };
      this.setVisible = function(isVisible, isMandatory) {
        var g = this.c.parent().parent().parent();
        this.setRequired(isMandatory);
        isVisible ? g.show() : g.hide();
        return this;
      };
      this.setDisable = function(isDisabled) {
        this.c.prop('disabled', isDisabled);
        return this;
      };
      this.setRequired = function(isRequired, customFunction, customMessage) {
        var g = c.parent().parent().siblings(".info");
        isRequired || customFunction != undefined ?
          Xrm.Portal.Utility.Validation.setValidation(g, this, isRequired, this.vg, customFunction, customMessage) :
          Xrm.Portal.Utility.Validation.removeValidation(g, this);
        return this;
      };
      this.attachOnChange = function(callback) {
        Xrm.Portal.Utility.Event.attachOnChange(this.c, callback);
        return this;
      };
      this.removeOnChange = function() {
        Xrm.Portal.Utility.Event.removeOnChange(this.c);
        return this;
      };
      this.setValidationGroup = function(g) {
        this.vg = g;
        return this;
      };
    },
    Radio: function(c) {
      this.s = Xrm.Portal.Utility.Selector;
      this.id = $(c).prop("id");

      this.c = c;
      this.vg = "";

      this.getValue = function() {
        return this.c.find("input:checked").val();
      };
      this.setValue = function(value) {
        if (value != null) {
          this.c.find("input[value*=" + value + "]").prop("checked", value);
        } else {
          this.c.find('input[type=radio]').prop('checked', false);
        }

        return this;
      };
      this.setVisible = function(isVisible, isMandatory) {
        var g = this.c.parent().parent();
        this.setRequired(isMandatory);
        isVisible ? g.show() : g.hide();
        return this;
      };
      this.setDisable = function(isDisabled) {
        this.c.find('input[type=radio]').prop("disabled", isDisabled);
        return this;
      };
      this.setRequired = function(isRequired, customFunction, customMessage) {
        var g = c.parent().siblings(".info");
        isRequired || customFunction != undefined ?
          Xrm.Portal.Utility.Validation.setValidation(g, this, isRequired, this.vg, customFunction, customMessage) :
          Xrm.Portal.Utility.Validation.removeValidation(g, this);
        return this;
      };
      this.attachOnChange = function(callback) {
        Xrm.Portal.Utility.Event.attachOnChange(this.c, callback);
        return this;
      };
      this.removeOnChange = function() {
        Xrm.Portal.Utility.Event.removeOnChange(this.c);
        return this;
      };
      this.setValidationGroup = function(g) {
        this.vg = g;
        return this;
      };
    },
    DatetimePicker: function(c) {
      this.s = Xrm.Portal.Utility.Selector;
      this.id = $(c).prop("id");

      this.c = c;
      this.vg = "";

      this.getValue = function() {
        return this.c.val();
      };
      this.getData = function() {
        return this.c.next().data('DateTimePicker');
      };
      this.setValue = function(value) {
        this.c.val(value);
        return this;
      };
      this.setVisible = function(isVisible, isMandatory) {
        var g = this.c.parent().parent();
        this.setRequired(isMandatory);
        isVisible ? g.show() : g.hide();
        return this;
      };
      this.setDisable = function(isDisabled) {
        this.s.getTextLabel(this.id).prop('disabled', isDisabled);
        return this;
      };
      this.setRequired = function(isRequired, customFunction, customMessage) {
        var g = c.parent().siblings(".info");
        isRequired || customFunction != undefined ?
          Xrm.Portal.Utility.Validation.setValidation(g, this, isRequired, this.vg, customFunction, customMessage) :
          Xrm.Portal.Utility.Validation.removeValidation(g, this);
        return this;
      };
      this.attachOnChange = function(callback) {
        Xrm.Portal.Utility.Event.attachDateTimePickerOnChange(this.c, callback);
        return this;
      };
      this.removeOnChange = function() {
        Xrm.Portal.Utility.Event.removeOnChange(this.c);
        return this;
      };
      this.setValidationGroup = function(g) {
        this.vg = g;
        return this;
      };
    },
    Canvas: function(id) {
      var canvas, context, tool;

      function init(id) {
        // Find the canvas element.
        canvas = document.getElementById(id + "Canvas");
        if (!canvas) {
          alert('Error: I cannot find the canvas element!');
          return;
        }

        if (!canvas.getContext) {
          alert('Error: no canvas.getContext!');
          return;
        }

        // Get the 2D canvas context.
        context = canvas.getContext('2d');
        if (!context) {
          alert('Error: failed to getContext!');
          return;
        }

        // Pencil tool instance.
        tool = new tool_pencil(id, canvas.id);

        // Attach the mousedown, mousemove and mouseup event listeners.
        canvas.addEventListener('mousedown', ev_canvas, false);
        canvas.addEventListener('mousemove', ev_canvas, false);
        canvas.addEventListener('mouseup', ev_canvas, false);
      }

      // This painting tool works like a drawing pencil which tracks the mouse 
      // movements.
      function tool_pencil(id, canvasId) {
        var id = id;
        var canvasId = canvasId;
        var tool = this;
        this.started = false;

        // This is called when you start holding down the mouse button.
        // This starts the pencil drawing.
        this.mousedown = function(ev) {
          context.beginPath();
          context.moveTo(ev._x, ev._y);
          tool.started = true;
        };

        // This function is called every time you move the mouse. Obviously, it only 
        // draws if the tool.started state is set to true (when you are holding down 
        // the mouse button).
        this.mousemove = function(ev) {
          if (tool.started) {
            context.lineTo(ev._x, ev._y);
            context.stroke();
          }
        };

        // This is called when you release the mouse button.
        this.mouseup = function(ev) {
          if (tool.started) {
            tool.mousemove(ev);
            tool.started = false;
          }
          Xrm.Portal.Form.get(id).setValue(document.getElementById(canvasId).toDataURL());
        };
      }

      // The general-purpose event handler. This function just determines the mouse 
      // position relative to the canvas element.
      function ev_canvas(ev) {
        if (ev.layerX || ev.layerX == 0) { // Firefox
          ev._x = ev.layerX;
          ev._y = ev.layerY;
        } else if (ev.offsetX || ev.offsetX == 0) { // Opera
          ev._x = ev.offsetX;
          ev._y = ev.offsetY;
        }

        // Call the event handler of the tool.
        var func = tool[ev.type];
        if (func) {
          func(ev);
        }
      }

      init(id);
    }
  },
  EventType: {
    OnChange: 1,
    OnClick: 2
  }
};