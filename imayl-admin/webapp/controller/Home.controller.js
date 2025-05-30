
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    'sap/ui/unified/ColorPickerPopover',
    "sap/ui/unified/ColorPickerDisplayMode",
    "sap/ui/unified/ColorPickerMode"
], (Controller, MessageToast, Filter, FilterOperator, ColorPickerPopover, ColorPickerDisplayMode, ColorPickerMode) => {
    "use strict";

    return Controller.extend("com.db.admin.imayladmin.controller.Home", {
        onInit() {
            this._oToday=new Date()
            this._oLast7Day = new Date();
            this._oLast7Day.setDate(this._oToday.getDate() - 7);
            this._aButton = "";
            this._excelData = [];
            if (typeof XLSX === 'undefined') {
                var sScriptUrl = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js";
                jQuery.getScript(sScriptUrl)
                    .done(() => console.log("XLSX library loaded successfully."))
                    .fail(() => {
                        console.error("Failed to load XLSX library.");
                        MessageToast.show("Failed to load Excel library.");
                    });
            }
            // let newdate=new Date();
            // let obj={};
            // let packageformDate="packageformDate";
            // let popovertoDate="popovertoDate";
            // let popoverfromdate = "popoverfromdate";
            // obj[packageformDate] = newdate;
            // obj[popovertoDate] = newdate;
            // obj[popoverfromdate] = newdate;
            let oModel = this.getOwnerComponent().getModel("requestpackageModel");
            oModel.setData({
                packageformDate: new Date(),
                popovertoDate: new Date(),
                popoverfromdate: new Date(),
                requestapackageformtablecount: 1,
                tableData: [{
                    Image: "1234",
                    Status: "Received",
                    IntNumber: "",
                    RefNumber: "",
                    RefDate: new Date(),
                    Package: "",
                    DeliveryLocation: "",
                    Weight: "",
                    Value: "",
                    MailBox: "",
                    StorageLocation: "",
                    Bin: "",
                    Notes: ""
                }],
                aliasList: [{ aliasName: "" }],
                tableCollection: [],
                CreateUserForm: {
                    accessType: "",
                    address1: "",
                    city: "",
                    country: null,
                    department: "",
                    emailID: "",
                    empID: "",
                    firstName: "",
                    language: null,
                    lastName: "",
                    location: "",
                    phone: "",
                    role: "",
                    state: "",
                    status: null,
                    userType: "",
                    zipcode: ""
                },
                CreateUser:
                {
                    notifyme: true,
                    Received: true,
                    AllStatuses: true,
                    Exception: true,
                    Delivered: true,
                    notifyothers: false,
                    SMS: true
                },
                Calendars: {
                    EndDateTime: this._oToday.toISOString().split("T")[0],
                    StartDateTime: this._oLast7Day.toISOString().split("T")[0],
                    Reason: ""
                }
            });
        },
        _setToggleButtonTooltip: function (bLarge) {
            let oToggleButton = this.byId('sideNavigationToggleButton');
            let logolarge = "https://cloud.imayl.com/Com/ProcessWeaver/IMAYL/Common/dist/img/logo.png";
            let logosmall = "https://cloud.imayl.com/Com/ProcessWeaver/IMAYL/Common/dist/img/mlogo.png";
            let apagelogo = this.getView().byId("logoId").getSrc();
            console.log(apagelogo);
            if (bLarge || apagelogo == logolarge) {
                this.getView().byId("logoId").setSrc(logosmall);
                oToggleButton.setTooltip('small Size Navigation');
            } else {
                oToggleButton.setTooltip('large Size Navigation');
                this.getView().byId("logoId").setSrc(logolarge);
            }
        },
        onMenuButtonPress: function () {
            var oSideNav = this.byId("sidecontent");

            if (oSideNav.hasStyleClass("mySmallSideNav")) {
                oSideNav.removeStyleClass("mySmallSideNav");
            } else {
                oSideNav.addStyleClass("mySmallSideNav");
            }
            let oToolPage = this.byId("mainpage");
            let bSideExpanded = oToolPage.getSideExpanded();

            // this._setToggleButtonTooltip(bSideExpanded);

            oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
        },
        onItemSelect: function (oEvent) {
            let oItem = oEvent.getParameter("item").getKey();
            let oNavContainer = this.byId("maincontainer");
            switch (oItem) {
                case "1":
                    oNavContainer.to(this.byId("AllPackagespage"));
                    break;
                case "2":
                    oNavContainer.to(this.byId("ReceiveaPackage_main"));
                    this._applySearchFilter("formtable");
                    break;
                case "3":
                    oNavContainer.to(this.byId("MyPackagespage"));
                    this._applySearchFilter("formtable");
                    break;
                case "4a":
                    oNavContainer.to(this.byId("SLACompliancepage"));
                    break;
                case "4b":
                    oNavContainer.to(this.byId("PendingDeliverypage"));
                    break;
                case "4c":
                    oNavContainer.to(this.byId("ResearchedPackagespage"));
                    break;
                case "4d":
                    oNavContainer.to(this.byId("UserProductivitypage"));
                    break;

                case "5a":
                    oNavContainer.to(this.byId("Carriersepage"));
                    break;
                case "5b":
                    oNavContainer.to(this.byId("PackageTypespage"));
                    break;
                case "5c":
                    oNavContainer.to(this.byId("PackageStatusespage"));
                    break;
                case "5d":
                    oNavContainer.to(this.byId("Locationspage"));
                    break;
                case "5e":
                    oNavContainer.to(this.byId("UserManagementpage"));
                    this._applySearchFilter("userstable");
                    break;
                case "5f":
                    oNavContainer.to(this.byId("Calendarpage"));
                    break;
                case "5g":
                    oNavContainer.to(this.byId("DeliveryLocationspage"));
                    break;
                case "5h":
                    oNavContainer.to(this.byId("Rolespage"));
                    break;

                case "6":
                    oNavContainer.to(this.byId("UserLogpage"));
                    this._applySearchFilter("userstable");
                    break;
                case "7":
                    oNavContainer.to(this.byId("EmailTemplatepage"));
                    this._applySearchFilter("userstable");
                    break;

                default:
                    oNavContainer.to(this.byId("AllPackagespage"));
                    break;
            }
        },
        onFilterselection: function (oEvent) {
            if (!this.filterPopOver) {
                this.filterPopOver = sap.ui.xmlfragment("com.db.admin.imayladmin.view.filterPopoverRP", this);
                this.getView().addDependent(this.filterPopOver);
            }
            this.filterPopOver.openBy(oEvent.getSource());
        },
        handleApplyPress: function () {
            this.filterPopOver.close();
        },
        handleCancelPress: function () {
            this.filterPopOver.close();
        },
        onAddReceiveAPackage: function () {
            // this.getView().byId("ReceiveaPackage_main").setVisible(false);
            // this.getView().byId("ReceiveaPackage_form").setVisible(true);
            // this._setToggleButtonTooltip(true);
            // this.byId("mainpage").setSideExpanded(false);
            // // console.log(aReceive_a_Package_mainpage);
            // // console.log(aReceive_a_Package_formpage);
            // console.log("wertyut");
            let oNavContainer = this.byId("maincontainer");
            oNavContainer.to(this.byId("ReceiveaPackage_form"));

        },
        oncancel: function () {
            // this.getView().byId("ReceiveaPackage_main").setVisible(true);
            // this.getView().byId("ReceiveaPackage_form").setVisible(false);
            // this._setToggleButtonTooltip(false);
            // this.byId("mainpage").setSideExpanded(true);

            // Get the model
            let oModel = this.getOwnerComponent().getModel("requestpackageModel");

            // Create a new array with just one empty row
            let aNewData = [{
                Image: "",
                Status: "Received",
                IntNumber: "",
                RefNumber: "",
                RefDate: new Date(),
                Package: "Box",
                DeliveryLocation: "",
                Weight: "",
                Value: "",
                MailBox: "",
                StorageLocation: "",
                Bin: "",
                Notes: ""
            }];

            // Reset the row count to 1
            oModel.setProperty("/requestapackageformtablecount", 1);

            // Set the new data to the model
            oModel.setProperty("/tableData", aNewData);
            let oNavContainer = this.byId("maincontainer");
            oNavContainer.to(this.byId("ReceiveaPackage_main"));

        },
        formatDateRange: function (fromdate, toDate) {
            let oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "MM/dd/yyyy" });
            return oDateFormat.format(fromdate) + " - " + oDateFormat.format(toDate);
        },
        calculateDays: function (fromDate, toDate) {
            if (!fromDate || !toDate) return "";
            let diffTime = toDate.getTime() - fromDate.getTime();
            let days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (days == 0) {
                return 1;
            }
            else {
                return days;
            }

        },
        onAddRow: function () {
            let oModel = this.getOwnerComponent().getModel("requestpackageModel");
            let aData = oModel.getProperty("/tableData");
            let aRowcount = oModel.getProperty("/requestapackageformtablecount");
            aData.push({
                Image: "",
                Status: "Received",
                IntNumber: "",
                RefNumber: "",
                RefDate: new Date(),
                Package: "Box",
                DeliveryLocation: "",
                Weight: "",
                Value: "",
                MailBox: "",
                StorageLocation: "",
                Bin: "",
                Notes: ""
            });
            oModel.setProperty("/requestapackageformtablecount", aRowcount + 1);

            oModel.setProperty("/tableData", aData);
        },
        onDeleteRow: function (oEvent) {
            // Get the row context from the event's source
            let oSource = oEvent.getSource();
            let oBindingContext = oSource.getBindingContext("requestpackageModel");

            // If no binding context is found, exit
            if (!oBindingContext) {
                return;
            }

            // Get the row index (path) from the binding context
            let sPath = oBindingContext.getPath();
            let iIndex = parseInt(sPath.substring(sPath.lastIndexOf('/') + 1));

            // Get the model and data
            let oModel = this.getOwnerComponent().getModel("requestpackageModel");
            let aData = oModel.getProperty("/tableData");
            let aRowcount = oModel.getProperty("/requestapackageformtablecount");
            // Check if there's only one row in the table
            if (aData.length <= 1) {
                // Don't allow deletion if only one row exists
                sap.m.MessageToast.show("Cannot delete the row");
                return;
            }

            // Remove the row at the specified index
            if (iIndex >= 0 && iIndex < aData.length) {
                aData.splice(iIndex, 1);
                aRowcount = Math.max(0, aRowcount - 1);

                // Update model
                oModel.setProperty("/requestapackageformtablecount", aRowcount);
                oModel.setProperty("/tableData", aData);

                // Show success message
                sap.m.MessageToast.show("Row deleted successfully");
            }

        },
        onOpenColumnftlter: function (oEvent) {
            this._aButton = oEvent.getSource().getParent().getParent().getId();
            if (this._aButton === 'application-comdbimaylimayl-display-component---MainView--formtable') {
                let aTablecolumns = [
                    { title: "Image" },
                    { title: "Status" },
                    { title: "Int #" },
                    { title: "Ref #" },
                    { title: "RefDate" },
                    { title: "Package" },
                    { title: "DeliveryLocation" },
                    { title: "Weight" },
                    { title: "Value" },
                    { title: "MailBox" },
                    { title: "StorageLocation" },
                    { title: "Bin" },
                    { title: "Notes" },
                    { title: "Action" }
                ];
                this.getOwnerComponent().getModel("requestpackageModel").setProperty("/tableCollection", aTablecolumns);
            }
            else {
                let aTablecolumns = [
                    { title: "First Name" },
                    { title: "Last Name" },
                    { title: "Role" },
                    { title: "Department" },
                    { title: "UserType" },
                    { title: "Location" },
                    { title: "Address1" },
                    { title: "Phone" },
                    { title: "Email" },
                    { title: "City" },
                    { title: "State" },
                    { title: "Country" },
                    { title: "Zipcode" },
                    { title: "Language" },
                    { title: "Status" },
                    { title: "Action" }

                ];
                this.getOwnerComponent().getModel("requestpackageModel").setProperty("/tableCollection", aTablecolumns);

            }
            if (!this.tablePopOver) {
                this.tablePopOver = sap.ui.xmlfragment("com.db.admin.imayladmin.view.tableSettingPopoverRP", this);
                this.getView().addDependent(this.tablePopOver);
            }
            // let oList = sap.ui.getCore().byId("CHKList");
            // sap.ui.getCore().byId("CHK").setSelected(true);

            // if (oList) {
            //     // Clear existing selections (optional)
            //     oList.removeSelections();

            //     // Select all list items
            //     var aItems = oList.getItems();
            //     aItems.forEach(function (oItem) {
            //         oList.setSelectedItem(oItem, true);
            //     });
            // }
            this.tablePopOver.openBy(oEvent.getSource());
        },
        onSelectionChange: function () {
            sap.ui.getCore().byId("CHK").setSelected(false);
        },
        onSelectAllColumns: function (oEvent) {
            let aselected = oEvent.getParameter("selected");
            var oList = oEvent.getSource().getParent().getItems()[2];
            let aListitems = oEvent.getSource().getParent().getItems()[2].getItems();
            aListitems.forEach(function (oItem) {
                oList.setSelectedItem(oItem, aselected);
            });
        },
        onApplyColumnChanges: function (oEvent) {
            let oTable;
            if (this._aButton === 'application-comdbimaylimayl-display-component---MainView--formtable') {
                oTable = this.byId("formtable");
            }
            else {
                oTable = this.byId("userstable");
            }
            let aColumns = oTable.getColumns();

            var oList = sap.ui.getCore().byId("CHKList");
            var aSelectedItems = oList.getSelectedItems();
            var aSelectedTitles = aSelectedItems.map(function (oItem) {
                return oItem.getTitle();
            });

            aColumns.forEach(function (oColumn) {
                // Try different approaches to get the header text
                var sHeaderText;

                // Try standard methods depending on the UI5 version and control type
                if (typeof oColumn.getLabel === "function") {
                    var oLabel = oColumn.getLabel();
                    if (oLabel && typeof oLabel.getText === "function") {
                        sHeaderText = oLabel.getText();
                    }
                } else if (typeof oColumn.getHeader === "function") {
                    var oHeader = oColumn.getHeader();
                    if (typeof oHeader === "string") {
                        sHeaderText = oHeader;
                    } else if (oHeader && typeof oHeader.getText === "function") {
                        sHeaderText = oHeader.getText();
                    }
                } else if (typeof oColumn.getHeaderText === "function") {
                    sHeaderText = oColumn.getHeaderText();
                }

                // If we have the header text, check if it's in the selected items
                if (sHeaderText) {
                    var bVisible = aSelectedTitles.includes(sHeaderText);
                    oColumn.setVisible(bVisible);
                }
            });

            this.tablePopOver.close();
        },
        onCancelColumnPopover: function () {
            this.tablePopOver.close();
        },
        onSearchColumn: function (oEvent) {
            // let sQuery=oEvent.getParameter("newValue").toLocaleLowerCase();
            // let aCheckboxIds=["ImageCHK","StatusCHK","IntCHK","RefCHK","RefDateCHK","PackageCHK","DeliveryCHK",""]
            // console.log(sQuery);
            var aFilters = [];
            var sQuery = oEvent.getSource().getValue();
            if (sQuery && sQuery.length > 0) {
                var filter = new Filter("title", FilterOperator.Contains, sQuery);
                aFilters.push(filter);
            }
            var oList = sap.ui.getCore().byId("CHKList");
            var oBinding = oList.getBinding("items");
            oBinding.filter(aFilters);
        },
        _applySearchFilter: function (tableid) {
            let oTable = this.byId(tableid);
            let aColumns = oTable.getColumns();

            aColumns.forEach(function (oColumn) {
                oColumn.setVisible(true); // Show all columns
            });

        },
        onCreateUser: function () {
            if (!this.CreateUserdialog) {
                this.CreateUserdialog = sap.ui.xmlfragment("com.db.admin.imayladmin.view.CreateAUser", this);
                this.getView().addDependent(this.CreateUserdialog);
            }
            this.CreateUserdialog.open();
            const oModel = this.getView().getModel(); // OData V4 model
            const oUsersBinding = oModel.bindList("/Users");

            oUsersBinding.requestContexts().then(function (aContexts) {
                aContexts.forEach(oContext => {
                    console.log(oContext.getObject());
                });
            });
        },
        onFileChange: function (oEvent) {
            const oUploader = oEvent.getSource();
            const aFiles = oUploader.oFileUpload.files;

            if (aFiles.length > 0) {
                const sFileName = aFiles[0].name;
                const oText = this.byId("fileNameText");
                const oDeleteBtn = this.byId("deleteButton");

                oText.setText(sFileName);
                oText.setVisible(true);
                oDeleteBtn.setVisible(true);
            }
            this.byId("uploader1").setVisible(false);
        },

        onUploadComplete: function (oEvent) {
            sap.m.MessageToast.show("File uploaded successfully: " + oEvent.getParameter("fileName"));
        },

        onDeleteFile: function () {
            const oUploader = this.byId("uploader1");
            const oText = this.byId("fileNameText");
            const oDeleteBtn = this.byId("deleteButton");

            // Reset input value
            oUploader.setValue("");
            oText.setText("");
            oText.setVisible(false);
            oDeleteBtn.setVisible(false);
            this.byId("uploader1").setVisible(true);
            sap.m.MessageToast.show("File removed.");
        },
        onAddAliasRow: function () {
            // Get the current alias model
            var oModel = this.getView().getModel("requestpackageModel");
            var aList = oModel.getProperty("/aliasList");

            // Push new alias entry
            aList.push({ aliasName: "" });
            oModel.setProperty("/aliasList", aList);

            sap.m.MessageToast.show("New alias row added.");
        },

        onDeleteAliasRow: function (oEvent) {
            // Get the item from binding context
            var oItem = oEvent.getSource().getParent();
            var oBindingContext = oItem.getBindingContext("requestpackageModel");
            var sPath = oBindingContext.getPath();
            if (oBindingContext.oModel.oData.aliasList.length > 1) {
                // Remove the item from the model
                var oModel = this.getView().getModel("requestpackageModel");
                var aList = oModel.getProperty("/aliasList");
                var iIndex = parseInt(sPath.split("/").pop());

                if (!isNaN(iIndex)) {
                    aList.splice(iIndex, 1);
                    oModel.setProperty("/aliasList", aList);
                    sap.m.MessageToast.show("Alias row deleted.");
                }
            }
        },
        onCreateUserFormClosePress: function () {
            this.CreateUserdialog.close();
            let newAlias = [{ aliasName: "" }];
            this.getOwnerComponent().getModel("requestpackageModel").setProperty("/aliasList", newAlias);

        },
        onSaveNewUser: function () {
            let abcd = this.getOwnerComponent().getModel("requestpackageModel").getProperty("/CreateUserForm");
            console.log(abcd);
            const oModel = this.getView().getModel(); // OData V4 model
            const oUsersBinding = oModel.bindList("/Users");
            oUsersBinding.create(abcd);
            this.getView().byId("userstable").getBinding("rows").refresh();
            this.CreateUserdialog.close();


        },
        onDeleteuserRow: function (oEvent) {
            let oModel = this.getView().getModel();
            let bookID = oEvent.getSource().getBindingContext().sPath.match(/\(([^)]+)\)/)[1];
            let oBindList = oModel.bindList("/Users");

            let aFilter = new sap.ui.model.Filter("ID", sap.ui.model.FilterOperator.EQ, bookID);

            oBindList.filter(aFilter).requestContexts().then(function (aContexts) {
                aContexts[0].delete();
            });
            this.getView().getModel().refresh();
            //this.getView().byId("userstable").getBinding("rows").refresh();
        },
        onAddExcel: function () {
            if (!this.Exceldialog) {
                this.Exceldialog = sap.ui.xmlfragment("com.db.admin.imayladmin.view.ExceluploadDialog", this);
                this.getView().addDependent(this.Exceldialog);
            }
            this.Exceldialog.open();

        },
        onExcelDialogClosePress: function () {
            var oFileUploader = sap.ui.getCore().byId("fileUploader");
            this.Exceldialog.close();
            if (oFileUploader) {
                oFileUploader.clear();
            }

        },
        onExcelFileChange: function (oEvent) {
            var oFile = oEvent.getParameter("files")[0];
            if (!oFile) {
                console.error("No file selected.");
                return;
            }

            var reader = new FileReader();
            reader.onload = (e) => {
                var data = new Uint8Array(e.target.result);
                var workbook = XLSX.read(data, { type: 'array' });
                console.log(data);
                console.log(workbook);
                this._excelData = [];
                // if there are more sheets in file -- workbook.SheetNames.forEach((sheetName) => {
                var XL_row_object = XLSX.utils.sheet_to_json(workbook.Sheets['Sheet1'], { header: 1 });
                console.log(XL_row_object);
                //to add id to each row
                // XL_row_object = XL_row_object.map((item, index) => ({
                //     ...item,
                //     autoID: Math.floor(Math.random() * 100000000)
                // }));
                // this._excelData = this._excelData.concat(XL_row_object);
                this._excelData = XL_row_object;

                console.log(`Total rows parsed: ${this._excelData.length}`);
                console.log(this._excelData),
                    MessageToast.show(`File parsed successfully. ${this._excelData.length} rows ready for upload.`);
            };

            reader.readAsArrayBuffer(oFile);
        },
        onExcelUpload: function (oEvent) {

            var oFileUploader = sap.ui.getCore().byId("fileUploader");
            // Convert array-of-arrays to array-of-objects
            var headers = this._excelData[0]; // first row
            var dataRows = this._excelData.slice(1); // all remaining rows
            var formattedData = dataRows.map(row => {
                var obj = {};
                headers.forEach((header, index) => {
                    obj[header] = String(row[index] || ""); // handle missing values
                });
                return obj;
            });

            // Optional: log the result
            console.log("Formatted Data:", formattedData);

            // POST to backend (example with OData V4 model)
            let oModel = this.getView().getModel(); // your OData model
            formattedData.forEach((entry) => {
                let oUsersBinding = oModel.bindList("/Users");
                oUsersBinding.create(entry);
            });
            this.Exceldialog.close();
            if (oFileUploader) {
                oFileUploader.clear();
            }
            // Clear the stored file
            this._excelData = null;
            this.getView().getModel().refresh();

            //this.getView().byId("userstable").getBinding("rows").refresh();

        },
        onAddEmail: function () {
            if (!this.CreateEmailDialog) {
                this.CreateEmailDialog = sap.ui.xmlfragment("com.db.admin.imayladmin.view.CreateEmail", this);
                this.getView().addDependent(this.CreateEmailDialog);
            }
            this.CreateEmailDialog.open();
        },
        onAddCarrier: function () {
            let oCarriers={
                Description: "",
                Name: "",
                ShipmentTrackingURL: null,
                Status: "Active"
            }
            this.getOwnerComponent().getModel("requestpackageModel").setProperty("/Carriers",oCarriers)
            if (!this.CreateCarrierDialog) {
                this.CreateCarrierDialog = sap.ui.xmlfragment("com.db.admin.imayladmin.view.CreateCarrier", this);
                this.getView().addDependent(this.CreateCarrierDialog);
            }
            this.CreateCarrierDialog.open();
        },
        onEditCarrier: function (oEvent) {
            let oData = oEvent.getSource().getBindingContext().getObject()
            this.getOwnerComponent().getModel("requestpackageModel").setProperty("/Carriers", oData);
            if (!this.CreateCarrierDialog) {
                this.CreateCarrierDialog = sap.ui.xmlfragment("com.db.admin.imayladmin.view.CreateCarrier", this);
                this.getView().addDependent(this.CreateCarrierDialog);
            }

            this.CreateCarrierDialog.open();
        },
        onAddPackageType: function () {
            let oPackage_Types= {
                Code: "",
                Name: "",
                Description: null,
                Status: "Active"
            };
            this.getOwnerComponent().getModel("requestpackageModel").setProperty("/Package_Types", oPackage_Types);
            if (!this.CreatePackageTypeDialog) {
                this.CreatePackageTypeDialog = sap.ui.xmlfragment("com.db.admin.imayladmin.view.CreatePackageType", this);
                this.getView().addDependent(this.CreatePackageTypeDialog);
            }
            this.CreatePackageTypeDialog.open();
        },
        onEditPackageType: function (oEvent) {
            let oData = oEvent.getSource().getBindingContext().getObject()
            this.getOwnerComponent().getModel("requestpackageModel").setProperty("/Package_Types", oData);
            if (!this.CreatePackageTypeDialog) {
                this.CreatePackageTypeDialog = sap.ui.xmlfragment("com.db.admin.imayladmin.view.CreatePackageType", this);
                this.getView().addDependent(this.CreatePackageTypeDialog);
            }
            this.CreatePackageTypeDialog.open();
        },
        onAddLocations: function () {
            let oLocations= {
                Code: "",
                Name: "",
                Address: "",
                City: "",
                State: "",
                Zipcode: "",
                Country: "",
                Phone: "",
                Status: "Active",
                Remarks: ""
            };
            this.getOwnerComponent().getModel("requestpackageModel").setProperty("/Locations", oLocations);

            if (!this.CreateLocationsDialog) {
                this.CreateLocationsDialog = sap.ui.xmlfragment("com.db.admin.imayladmin.view.CreateLocations", this);
                this.getView().addDependent(this.CreateLocationsDialog);
            }
            this.CreateLocationsDialog.open();
        },
        onEditLocations: function (oEvent) {
            let oData = oEvent.getSource().getBindingContext().getObject()
            this.getOwnerComponent().getModel("requestpackageModel").setProperty("/Locations", oData);
            
            if (!this.CreateLocationsDialog) {
                this.CreateLocationsDialog = sap.ui.xmlfragment("com.db.admin.imayladmin.view.CreateLocations", this);
                this.getView().addDependent(this.CreateLocationsDialog);
            }
            this.CreateLocationsDialog.open();
        },
        onAddRoles: function () {
            if (!this.CreateRolesDialog) {
                this.CreateRolesDialog = sap.ui.xmlfragment("com.db.admin.imayladmin.view.CreateRoles", this);
                this.getView().addDependent(this.CreateRolesDialog);
            }
            this.CreateRolesDialog.open();
        },
        onEditRoles: function (oEvent) {
            let oData = oEvent.getSource().getBindingContext().getObject()
            this.getOwnerComponent().getModel("requestpackageModel").setProperty("/Roles", oData);
            
            if (!this.CreateRolesDialog) {
                this.CreateRolesDialog = sap.ui.xmlfragment("com.db.admin.imayladmin.view.CreateRoles", this);
                this.getView().addDependent(this.CreateRolesDialog);
            }
            this.CreateRolesDialog.open();
        },
        onAddDeliveryLocations: function () {
            let oDelivery_Locations= {
                LocationCode: "",
                LocationName: "",
                LocationStatus: "Active",
                LocationRemarks: ""
            };
            this.getOwnerComponent().getModel("requestpackageModel").setProperty("/Delivery_Locations", oDelivery_Locations);

            if (!this.CreateDeliveryLocationsDialog) {
                this.CreateDeliveryLocationsDialog = sap.ui.xmlfragment("com.db.admin.imayladmin.view.CreateDeliveryLocations", this);
                this.getView().addDependent(this.CreateDeliveryLocationsDialog);
            }
            this.CreateDeliveryLocationsDialog.open();
        },
        onEditDeliveryLocations: function (oEvent) {
            let oData = oEvent.getSource().getBindingContext().getObject()
            this.getOwnerComponent().getModel("requestpackageModel").setProperty("/Delivery_Locations", oData);
            
            if (!this.CreateDeliveryLocationsDialog) {
                this.CreateDeliveryLocationsDialog = sap.ui.xmlfragment("com.db.admin.imayladmin.view.CreateDeliveryLocations", this);
                this.getView().addDependent(this.CreateDeliveryLocationsDialog);
            }
            this.CreateDeliveryLocationsDialog.open();
        },

        _countOfPackagestatus: function () {
            const oModel = this.getView().getModel();
            const oBindList = oModel.bindList("/Package_Statuses");
        
            return oBindList.requestContexts()
                .then(function (aContexts) {
                    return aContexts.length;
                })
                .catch(function (oError) {
                    console.error("Failed to get count:", oError);
                    return 0;
                });
        },
        onAddPackageStatuses:async function () {
            const iCount = await this._countOfPackagestatus(); // wait for count

            let oPackage_Statuses= {
                Code: "",
                Description: "",
                Templates: "",
                Type: "Normal",
                ColorPicker: "",
                OrderFlow: iCount+1,
                Status: "Active",
                PhotoRequired: false,
                SignatureRequired: false,
                HideTracking: false
            };
            this.getOwnerComponent().getModel("requestpackageModel").setProperty("/Package_Statuses", oPackage_Statuses);

            if (!this.CreatePackageStatusesDialog) {
                this.CreatePackageStatusesDialog = sap.ui.xmlfragment("com.db.admin.imayladmin.view.CreatePackageStatuses", this);
                this.getView().addDependent(this.CreatePackageStatusesDialog);
            }
            this.CreatePackageStatusesDialog.open();
        },
        onEditPackageStatuses: function (oEvent) {
            let oData = oEvent.getSource().getBindingContext().getObject()
            this.getOwnerComponent().getModel("requestpackageModel").setProperty("/Package_Statuses", oData);
            
            if (!this.CreatePackageStatusesDialog) {
                this.CreatePackageStatusesDialog = sap.ui.xmlfragment("com.db.admin.imayladmin.view.CreatePackageStatuses", this);
                this.getView().addDependent(this.CreatePackageStatusesDialog);
            }
            this.CreatePackageStatusesDialog.open();
        },
        openLiveChangeSample: function (oEvent) {
            this.inputId = oEvent.getSource().getId();
            if (!this.oColorPickerLiveChangePopover) {
                this.oColorPickerLiveChangePopover = new ColorPickerPopover("oColorPickerLiveChangePopover", {
                    colorString: "orange",
                    displayMode: ColorPickerDisplayMode.Simplified,
                    mode: ColorPickerMode.HSL,
                    change: this.handleChange.bind(this),
                    liveChange: this.handleLiveChange.bind(this)
                });
            }
            this.oColorPickerLiveChangePopover.openBy(oEvent.getSource());
        },
        handleChange: function (oEvent) {
            var oView = this.getView(),
                oInput = oView.byId(this.inputId);

            oInput.setValue(oEvent.getParameter("colorString"));
            oInput.setValueState(ValueState.None);
            this.inputId = "";
            MessageToast.show("Chosen color string: " + oEvent.getParameter("colorString"));
        },
        handleLiveChange: function (oEvent) {
            var oView = this.getView();
        },
        onSelectCalenderRow:function(oEvent){
            var oTable = oEvent.getSource();
            var iSelectedIndex = oTable.getSelectedIndex();
            if (iSelectedIndex >= 0) {
                var oContext = oTable.getContextByIndex(iSelectedIndex);
                if (oContext) {
                    var oRowData = oContext.getObject();
                    console.log("Selected Row Data:", oRowData);
                    this.getOwnerComponent().getModel("requestpackageModel").setProperty("/Calendars", oRowData);

                }
            }
            else{
                let oCalendars= {
                    EndDateTime: this._oToday.toISOString().split("T")[0],
                    StartDateTime: this._oLast7Day.toISOString().split("T")[0],
                    Reason: ""
                 }
                this.getOwnerComponent().getModel("requestpackageModel").setProperty("/Calendars", oCalendars);

            }
        },
        _PostData: function (oProperty, aPage) {
            let oNewData = this.getOwnerComponent().getModel("requestpackageModel").getProperty(oProperty);
            const oModel = this.getView().getModel();
            if (!oNewData.ID) {
                const oUsersBinding = oModel.bindList(oProperty);
                oUsersBinding.create(oNewData);
            }
            else {
                let sId = oNewData.ID;
                let sPath = oProperty+`(${sId})`;
                console.log(sPath);
                const sBaseUrl = sap.ui.require.toUrl("com/db/admin/imayladmin");
                $.ajax({
                    url: sBaseUrl+ "/odata/v4/imailservice"+sPath, // Adjust the URL and key
                    method: "PUT", // or use "PATCH" depending on the backend
                    contentType: "application/json",
                    data: JSON.stringify(oNewData),
                    success: function (response) {
                        sap.m.MessageToast.show("Update successful");
                        console.log("Success response:", response);
                    },
                    error: function (xhr, status, error) {
                        sap.m.MessageBox.error("Update failed: " + error);
                        console.error("Error:", xhr.responseText);
                    }
                });
                
                
            }
            let sTableId = aPage + "_table"
            this.getView().byId(sTableId).getBinding("rows").refresh();

        },
        onAddNewData: function (oEvent) {
            let aDialogBoxId = oEvent.getSource().oParent.sId;

            switch (aDialogBoxId) {
                case "CreateCarrierDialog":
                    this._PostData("/Carriers", "Carriers")
                    
                    this.CreateCarrierDialog.close();
                    break;
                case "CreatePackageTypeDialog":
                    this._PostData("/Package_Types", "Package_Types")
                    this.CreatePackageTypeDialog.close();
                    break;
                case "CreatePackageStatusesDialog":
                    this._PostData("/Package_Statuses", "Package_Statuses")
                    this.CreatePackageStatusesDialog.close();
                    break;
                case "CreateLocationsDialog":
                    this.CreateLocationsDialog.close();
                    this._PostData("/Locations", "Locations")
                    break;
                case "CreateDeliveryLocationsDialog":
                    this.CreateDeliveryLocationsDialog.close();
                    this._PostData("/Delivery_Locations", "Delivery_Locations")
                    break;
                case "CreateRolesDialog":
                    this.CreateRolesDialog.close();
                    this._PostData("/Roles", "Roles")
                    break;
                case "CreateEmailDialog":
                    this._PostData("/newCarrier", "/Carriers")
                    this.CreateEmailDialog.close();
                    break;

            }
        },
        onCreateEmailClosePress: function (oEvent) {
            let aDialogBoxId = oEvent.getSource().oParent.oParent.sId;

            switch (aDialogBoxId) {
                case "CreateCarrierDialog":
                    this.CreateCarrierDialog.close();
                    break;
                case "CreatePackageTypeDialog":
                    this.CreatePackageTypeDialog.close();
                    break;
                case "CreatePackageStatusesDialog":
                    this.CreatePackageStatusesDialog.close();
                    break;
                case "CreateLocationsDialog":
                    this.CreateLocationsDialog.close();
                    break;
                case "CreateDeliveryLocationsDialog":
                    this.CreateDeliveryLocationsDialog.close();
                    break;
                case "CreateRolesDialog":
                    this.CreateRolesDialog.close();
                    break;

                case "CreateEmailDialog":
                    this.CreateEmailDialog.close();
                    break;

            }
        },
        _DeleteData:function(sPath,sProperty){
            let oModel = this.getView().getModel();
            oModel.delete(sPath).then(() => {
                MessageToast.show(sProperty+"Deleted successfully");
            }).catch((oError) => {
                MessageToast.show("Delete failed");
                console.error("Delete failed:", oError);
            });
            let sTableId = sProperty + "_table"
            this.getView().byId(sTableId).getBinding("rows").refresh();
        },
        onDeleteRowData: function (oEvent) {
            let sFullId = oEvent.getSource().getId();
            var oView = this.getView();
            var sLocalId = oView.getLocalId(sFullId);
            let sButtonId=sLocalId.split("-")[0];
            let sPath=oEvent.getSource().getParent().getBindingContext().getPath();
            switch (sButtonId) {
                case "Carriers_delete":
                    this._DeleteData(sPath, "Carriers")
                    break;
                case "Package_Types_delete":
                    this._DeleteData(sPath, "Package_Types")
                    break;
                case "Package_Statuses_delete":
                    this._DeleteData(sPath, "Package_Statuses")
                    break;
                case "Locations_delete":
                    this._DeleteData(sPath, "Locations")
                    break;
                case "Delivery_Locations_delete":
                    this._DeleteData(sPath, "Delivery_Locations")
                    break;
                case "Roles_delete":
                    this._DeleteData(sPath, "Roles")
                    break;
                case "Carrie_delete":
                    this._DeleteData("/newCarrier", "/Carriers")
                    break;

            }
        }



    });
});