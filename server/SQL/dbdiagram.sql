
 TABLE "Person"
{
    "ID" int  
    "FullName" varchar 
    "Email" varchar  
    "Password" varchar  
    "DateOfBirth" date
    "PersonType" integer
    "PersonRole" integer
    "PicturePath" varchar
    "googleProviderId" varchar    
    "googleAccessToken" varchar
}

TABLE "Address"
{
    "AddressID" int  
    "StreetAddress" varchar
    "City" varchar
    "Country" varchar
    "PostCode" integer
}

 TABLE "Orders"
{
    "OrderID" int  
    "PickAddressID" integer  
    "DropAddressID" integer  
    "PickDate" date
    "ArrivalDate" date
    "PersonID" integer
    "ReceiverPersonID" integer
    "Status" varchar
    "CompanyId" integer;
}
    

 TABLE "Incident"
{
    "IncidentId" int  
    "Description" varchar
    "OrderId" integer
    "PersonId" integer
    
}

TABLE "Sensor"
{
    "Id" int  
    "Name" varchar
    "Description" varchar
    "MinValue" varchar
    "MaxValue" varchar
    "DisplayUnit" varchar
}

TABLE "OrderSensors"
{
    "Id" int
    "OrderId" integer  
    "SensorId" integer  
    "MinThreshold" integer
    "MaxThreshold" integer
    valuerecorded varchar
    light integer
	 heavy integer
	 severe integer;
}

TABLE "Company"
{
    "Id" int  
    "Name" varchar
    "Description" varchar
}  

 TABLE "OrderHistory"
{
    "Id" int
    "OrderId" integer
    "PostmanId" integer
    "HandoverDate" date
    "Status" varchar
    "bc_light" integer
	"bc_heavy" integer
    "bc_temprature" integer
	"bc_severe" integer;
}