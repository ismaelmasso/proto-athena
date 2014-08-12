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
 * VisibleSiteWorkflows component.
 * 
 * @namespace Alfresco
 * @class Alfresco.VisibleSiteWorkflows
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
    * VisibleSiteWorkflows constructor.
    * 
    * @param {String} htmlId The HTML id of the parent element
    * @return {Alfresco.VisibleSiteWorkflows} The new VisibleSiteWorkflows instance
    * @constructor
    */
   Alfresco.VisibleSiteWorkflows = function(htmlId)
   {
      Alfresco.VisibleSiteWorkflows.superclass.constructor.call(this, "Alfresco.VisibleSiteWorkflows", htmlId, ["button", "container", "datasource", "datatable", "json"]);

      /* Initialise prototype properties */
      this.listWidgets = [];
      this.uniqueRecordId = 1;

      // Decoupled event listeners
      YAHOO.Bubbling.on("workflowAdded", this.onWorkflowAdded, this);

      return this;
   };
   
   YAHOO.extend(Alfresco.VisibleSiteWorkflows, Alfresco.component.Base,
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
          * siteId to VisibleSiteWorkflows in. "" if VisibleSiteWorkflows should be cross-site
          *
          * @property siteId
          * @type string
          */
         siteId: "",

          /**
           * Can be "add" or "select"; depending on the value, UI and features will change
           *
           * @property action
           * @type string
           */
         action: "add"

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
      onReady: function VisibleSiteWorkflows_onReady()
      {
         // WebKit CSS fix
         if (YAHOO.env.ua.webkit > 0)
         {
            Dom.setStyle(this.id + "-backTo", "vertical-align", "sub");
         }

         // setup the datasource
         var visibleSiteWorkflowsUrl = Alfresco.constants.PROXY_URI + "/api/workflow-definitions";
         if (this.options.action == "select") {
            visibleSiteWorkflowsUrl += "?sites=" + this.options.siteId
         }

         // button to add all groups in the list
         this.widgets.addButton = Alfresco.util.createYUIButton(this, "add-button", this.addButtonClick);

         this.widgets.dataSource = new YAHOO.util.DataSource(visibleSiteWorkflowsUrl,
         {
            responseType: YAHOO.util.DataSource.TYPE_JSON,
            connXhrMode: "queueRequests",
            responseSchema:
            {
                resultsList: "data"
            }
         });

         // setup of the datatable
         this._setupDataTable();

         var me = this;
         var fnActionItemHandler = function VisibleSiteWorkflows_fnActionItemHandler(layer, args)
            {
               if (me.options.action == "select") {
                   // call the remove method
                   me.removeItem.call(me, args[1].anchor);
                   args[1].stop = true;
               } else if (me.options.action == "add") {
                   //@TODO - Would be cleaner to access data, instead of navigating HTML
                   //@TODO - This is a very ugly/weak statement, fix it ASAP
                   var containerEl = args[1].el.parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.firstElementChild;

                   //@TODO - I really don't like how workflow name/title is extracted by the HTML
                   var name = containerEl.firstElementChild.textContent;
                   var title = containerEl.textContent.split(name)[0].trim();
                   name = name.replace('(','').replace(')','').trim();

                   YAHOO.Bubbling.fire("workflowAdded",
                   {
                      workflowDetails:
                      {
                         name: name,
                         title: title
                      }
                   });
               }
               return true;
            };
         YAHOO.Bubbling.addDefaultAction(this.options.action+"-item-button", fnActionItemHandler);
      },

      /**
       * Setup YUI DataTable widget
       *
       * @method _setupDataTable
       * @private
       */
      _setupDataTable: function VisibleSiteWorkflows_setupDataTable()
      {
         /**
          * DataTable Cell Renderers
          *
          * Each cell has a custom renderer defined as a custom function. See YUI documentation for details.
          * These MUST be inline in order to have access to the Alfresco.VisibleSiteWorkflows class (via the "me" variable).
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
         var renderCellDescription = function VisibleSiteWorkflows_renderCellDescription(elCell, oRecord, oColumn, oData)
         {
            // we currently render all results the same way
            var itemName = oRecord.getData("name"),
               displayName = oRecord.getData("title");

            elCell.innerHTML = '<h3 class="itemname">' + $html(displayName) + ' <span class="lighter theme-color-1">(' + $html(itemName) + ')</span></h3>';
         };

         /**
          * Add item datacell formatter
          *
          * @method renderCellRemoveButton
          * @param elCell {object}
          * @param oRecord {object}
          * @param oColumn {object}
          * @param oData {object|string}
          */
         var renderCellAddButton = function VisibleSiteWorkflows_renderCellAddButton(elCell, oRecord, oColumn, oData)
         {
            Dom.setStyle(elCell.parentNode, "width", oColumn.width + "px");

                desc =
               '<span id="' + me.id + '-addItem">' +
               '  <a href="#" class="'+me.options.action+'-item-button"><span class="'+me.options.action+'Icon">&nbsp;</span></a>' +
               '</span>';
            elCell.innerHTML = desc;
         };

         // DataTable column definitions
         var columnDefinitions =
         [
            { key: "item", label: "Item", sortable: false, formatter: renderCellDescription },
            { key: "action", label: "Action", sortable: false, formatter: renderCellAddButton, width: 30 }
         ];

         // DataTable definition
         this.widgets.dataTable = new YAHOO.widget.DataTable(this.id + "-workflowlist", columnDefinitions, this.widgets.dataSource,
         {
            MSG_EMPTY: this.msg("workflowlist.empty-list")
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
      onWorkflowAdded: function VisibleSiteWorkflows_onWorkflowAdded(layer, args)
      {
         if (this.options.action == "select") {
             var data = args[1].workflowDetails,
                dupFound = false,
                itemData =
                {
                   id: this.uniqueRecordId++,
                   name: data.name,
                   title: data.title
             };

             //Avoid duplicates
             var records = this.widgets.dataTable.getRecordSet().getRecords();
             for (var i = 0; i < records.length; i++) {
               itemName = records[i].getData("name")
               if (itemName == data.name) {
                  dupFound = true;
               }
             }
             if (!dupFound) {
               this.widgets.dataTable.addRow(itemData);
             }
         }
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
       * Event handler for "Add" button click. Initiates the add process
       *
       * @method addButtonClick
       * @param e {Object} Event arguments
       */
      addButtonClick: function VisibleSiteWorkflows_addButtonClick(e)
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

         //Create JSON payload
         var dataPayload = { workflows: [] };
         for (var i = 0; i < recordSet.getLength(); i++) {
             dataPayload.workflows.push({
                 itemName: recordSet.getRecord(i).getData("name")
             });
         }

         // success handler
         var success = function VisibleSiteWorkflows__doAddResult_success(response)
         {
            recordSet.success = true;
         };

         var failure = function VisibleSiteWorkflows__doAddResult_failure(response)
         {
            recordSet.failure = true;
         };

         //Submit the JSON payload to Repo Webscript
         Alfresco.util.Ajax.request(
         {
            url: Alfresco.constants.PROXY_URI + "api/sites/" + this.options.siteId + "/visiblesiteworkflows",
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
