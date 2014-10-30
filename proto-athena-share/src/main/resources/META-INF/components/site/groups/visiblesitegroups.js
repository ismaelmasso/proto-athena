/**
 * Copyright (C) 2005-2010 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */
 
/**
 * VisibleSiteGroupsList component.
 * 
 * @namespace Alfresco
 * @class Alfresco.VisibleSiteGroupsList
 */
(function()
{  
   /**
    * YUI Library aliases
    */
   var Dom = YAHOO.util.Dom,
      Event = YAHOO.util.Event,
      Element = YAHOO.util.Element;
    
   /**
    * Alfresco Slingshot aliases
    */
   var $html = Alfresco.util.encodeHTML;

   /**
    * VisibleSiteGroupsList constructor.
    * 
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.VisibleSiteGroupsList} The new VisibleSiteGroupsList instance
    * @constructor
    */
   Alfresco.VisibleSiteGroupsList = function(htmlId)
   {
      Alfresco.VisibleSiteGroupsList.superclass.constructor.call(this, "Alfresco.VisibleSiteGroupsList", htmlId, ["button", "container", "datasource", "datatable", "json"]);

      /* Initialise prototype properties */
      this.listWidgets = [];
      this.uniqueRecordId = 1;

      // Decoupled event listeners
      YAHOO.Bubbling.on("itemSelected", this.onItemSelected, this);
      YAHOO.Bubbling.on("hideUnhideButton", this.onhideUnhideButton, this);
      return this;
   };
   
   YAHOO.extend(Alfresco.VisibleSiteGroupsList, Alfresco.component.Base,
   {
      /**
       * Object container for initialization options
       *
       * @property options
       * @type object
       */
      options:
      {
         /**
          * siteId to VisibleSiteGroupsList in. "" if VisibleSiteGroupsList should be cross-site
          *
          * @property siteId
          * @type string
          */
         siteId: ""
      },

      /**
       * Object container for storing YUI widget instances used in the list cells
       * @property listWidgets
       * @type array
       */
      listWidgets: null,

      /**
       * Auto-incremented unique id for each element added to the table.
       * @property uniqueRecordId
       * @type integer
       */
      uniqueRecordId: null,

      /**
       * Fired by YUI when parent element is available for scripting.
       * Component initialisation, including instantiation of YUI widgets and event listener binding.
       *
       * @method onReady
       */
      onReady: function VisibleSiteGroupsList_onReady()
      {
         // WebKit CSS fix
         if (YAHOO.env.ua.webkit > 0)
         {
            Dom.setStyle(this.id + "-backTo", "vertical-align", "sub");
         }

         // button to add all groups in the list
         this.widgets.addButton = Alfresco.util.createYUIButton(this, "add-button", this.addButtonClick,{disabled: true});

         // setup the datasource
         var visibleSiteGroupsUrl = Alfresco.constants.PROXY_URI + "/api/sites/" + this.options.siteId + "/visiblesitegroups"
         this.widgets.dataSource = new YAHOO.util.DataSource(visibleSiteGroupsUrl,
         {
            responseType: YAHOO.util.DataSource.TYPE_JSON,
            connXhrMode: "queueRequests",
            responseSchema:
            {
                resultsList: "groups"
            }
         });
         
         this.widgets.righturl=visibleSiteGroupsUrl;
         var rightSiteList = this.rightList.call(this,this);
  		 this.widgets.rightSiteList = rightSiteList;

         // setup of the datatable
         this._setupDataTable();

         // Hook remove action handler
         var me = this,
            fnRemoveItemHandler = function VisibleSiteGroupsList_fnRemoveItemHandler(layer, args)
            {
               // call the remove method
               me.removeItem.call(me, args[1].anchor);
               YAHOO.Bubbling.fire("hideUnhideButton",args[1]);
               args[1].stop = true;
               return true;
            };

         YAHOO.Bubbling.addDefaultAction("remove-item-button", fnRemoveItemHandler);
      },

      /**
       * Setup YUI DataTable widget
       *
       * @method _setupDataTable
       * @private
       */
      _setupDataTable: function VisibleSiteGroupsList_setupDataTable()
      {
         /**
          * DataTable Cell Renderers
          *
          * Each cell has a custom renderer defined as a custom function. See YUI documentation for details.
          * These MUST be inline in order to have access to the Alfresco.VisibleSiteGroupsList class (via the "me" variable).
          */
         var me = this;

         /**
          * Description/detail custom datacell formatter
          *
          * @method renderCellDescription
          * @param elCell {object}
          * @param oRecord {object}
          * @param oColumn {object}
          * @param oData {object|string}
          */
         var renderCellDescription = function VisibleSiteGroupsList_renderCellDescription(elCell, oRecord, oColumn, oData)
         {
            // we currently render all results the same way
            var itemName = oRecord.getData("itemName"),
               displayName = oRecord.getData("displayName");

            elCell.innerHTML = '<h3 class="itemname">' + $html(displayName) + ' <span class="lighter theme-color-1">(' + $html(itemName) + ')</span></h3>';
         };

         /**
          * Remove item datacell formatter
          *
          * @method renderCellRemoveButton
          * @param elCell {object}
          * @param oRecord {object}
          * @param oColumn {object}
          * @param oData {object|string}
          */
         var renderCellRemoveButton = function VisibleSiteGroupsList_renderCellRemoveButton(elCell, oRecord, oColumn, oData)
         {
            Dom.setStyle(elCell.parentNode, "width", oColumn.width + "px");

            var desc =
               '<span id="' + me.id + '-removeItem">' +
               '  <a href="#" class="remove-item-button"><span class="removeIcon">&nbsp;</span></a>' +
               '</span>';
            elCell.innerHTML = desc;
         };

         // DataTable column definitions
         var columnDefinitions =
         [
            { key: "item", label: "Item", sortable: false, formatter: renderCellDescription },
            { key: "remove", label: "Remove", sortable: false, formatter: renderCellRemoveButton, width: 30 }
         ];

         // DataTable definition
         this.widgets.dataTable = new YAHOO.widget.DataTable(this.id + "-grouplist", columnDefinitions, this.widgets.dataSource,
         {
            MSG_EMPTY: this.msg("grouplist.empty-list")
         });
      },

      /**
       * Event handler for "itemSelected" bubbling event.
       * Adds an item to the list.
       *
       * @method onItemSelected
       * @param layer {object} Event fired
       * @param args {array} Event parameters (depends on event type)
       */
      onItemSelected: function VisibleSiteGroupsList_onItemSelected(layer, args)
      {
         var data = args[1],
            dupFound = false,
            itemData =
            {
               id: this.uniqueRecordId++,
               itemName: data.itemName,
               displayName: data.itemName.substring(data.itemName.indexOf('_')+1)
            };

         var records = this.widgets.dataTable.getRecordSet().getRecords();
         for (var i = 0; i < records.length; i++) {
           itemName = records[i].getData("itemName")
           if (itemName == data.itemName) {
              dupFound = true;
           }
         }

         if (!dupFound) {
           this.widgets.dataTable.addRow(itemData);
         }
         this._enableDisableAddButton();
         YAHOO.Bubbling.fire("hideUnhideButton",args[1]);
      },

      /**
       * Remove item action handler
       *
       * @method removeItem
       * @param row {HTMLElement} DOM reference to a TR element (or child thereof)
       */
      removeItem: function VisibleSiteGroupsList_removeItem(row)
      {
         var record = this.widgets.dataTable.getRecord(row);

         // Fire the personDeselected event
         YAHOO.Bubbling.fire("itemDeselected",
         {
            itemName: record.getData("itemName")
         });

         // remove the element
         this.widgets.dataTable.deleteRow(record);
      },

      /**
       * Enables or disables the add button.
       *
       * @method _enableDisableAddButton
       */
      _enableDisableAddButton: function VisibleSiteGroupsList__enableDisableAddButton()
      {
         var enabled = this.widgets.dataTable.getRecordSet().getLength() > 0;
         this.widgets.addButton.set("disabled", !enabled);
      },

      /**
       * Event handler for "Add" button click. Initiates the add process
       *
       * @method addButtonClick
       * @param e {Object} Event arguments
       */
      addButtonClick: function VisibleSiteGroupsList_addButtonClick(e)
      {
         // sanity check - the add button shouldn't be clickable in this case
         var recordSet = this.widgets.dataTable.getRecordSet();
         if (recordSet.getLength() < 0)
         {
            this._enableDisableAddButton();
            return;
         }

         // show a wait message
         this.widgets.feedbackMessage = Alfresco.util.PopupManager.displayMessage(
         {
            text: this.msg("message.please-wait"),
            spanClass: "wait",
            displayTime: 0
         });

         // kick off the processing
         this._processResultSet(recordSet);
      },

      /**
       * Processes the result data.
       *
       * @method _processResultData
       * @param resultData {Object}
       * @private
       */
      _processResultSet: function VisibleSiteGroupsList__processResultSet(recordSet)
      {
         // check if we are already done
         if (recordSet.index >= recordSet.size)
         {
            this._finalizeResults(recordSet);
            return;
         }

         this._doAddResults(recordSet);
      },
      
      onhideUnhideButton : function VisibleSiteGroupsList_onhideUnhideButton(layer, args)
      {
    	  var records = this.widgets.dataTable.getRecordSet().getRecords(); 
          if(this.widgets.rightSiteList!=null&&this.widgets.rightSiteList.groups!=null&&this.widgets.rightSiteList.groups.length!=null && records!=null && records.length!=null && this.widgets.rightSiteList.groups.length==records.length)
         	 {
        	  var dis = true;
         	 for (var j = 0; j < this.widgets.rightSiteList.groups.length; j++)
   	   		{
         		 var found = false;
         		 for (var i = 0; i < records.length; i++) {
                      itemName = records[i].getData("itemName");
                      if (itemName == this.widgets.rightSiteList.groups[j].itemName) {
                    	  found=true;
                     	 break;
                      }
                    }
         		 if(found){
         			dis=true; 
         		 }else
         			 {
         			dis = false;
         			break;
         			 };
   	   		}
 			 this.widgets.addButton.set('disabled', dis);
         	 }else
         		 {
         		 this.widgets.addButton.set('disabled', false);
         		 }
      },
      
      rightList: function WorkFlowRightList(me)
      {
    	  //get the site list and remove them in all workflowlist
   			var xhr = new XMLHttpRequest();	 
    		xhr.open("GET",  me.widgets.righturl, false);
    		xhr.send(null);
    		var responseText = xhr.responseText;
    		return  eval('(' + responseText + ')');
      },

      /**
       * Adds one result and returns to _processResultData on completion.
       *
       * @method _doAddResult
       * @param resultData {Object}
       * @private
       */
      _doAddResults: function VisibleSiteGroupsList__doAddResults(recordSet)
      {
         // success handler
         var success = function VisibleSiteGroupsList__doAddResult_success(response)
         {
        	this.widgets.rightSiteList = this.rightList.call(this,this);
            this.widgets.addButton.set('disabled', true);
            recordSet.success = true;
            this._processResultData(recordSet);
         };

         var failure = function VisibleSiteGroupsList__doAddResult_failure(response)
         {
            recordSet.failure = true;
            this._processResultData(recordSet);
         };

         //Create JSON payload
         var dataPayload = { groups: [] };
         for (var i = 0; i < recordSet.getLength(); i++) {
             dataPayload.groups.push({
                 itemName: recordSet.getRecord(i).getData("itemName")
             });
         }

         //Submit the JSON payload to Repo Webscript
         Alfresco.util.Ajax.request(
         {
            url: Alfresco.constants.PROXY_URI + "api/sites/" + this.options.siteId + "/visiblesitegroups",
            method: "POST",
            requestContentType: "application/json",
            responseContentType: "application/json",
            dataObj: dataPayload,
            successCallback:
            {
               fn: success,
               scope: this
            },
            failureCallback:
            {
               fn: failure,
               scope: this
            }
         });

         // remove wait message
         this.widgets.feedbackMessage.destroy();

          // show a feedback message
          this.widgets.feedbackMessage = Alfresco.util.PopupManager.displayMessage(
          {
             text: this.msg("message.result"),
             spanClass: "wait",
             displayTime: 1
          });
      }
   });
})();
