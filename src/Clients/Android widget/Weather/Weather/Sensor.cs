using System.Collections.Generic;

namespace Weather
{
    public class Sensor
    {
        public string SensoreCode { get; set; }
        public string SensoreName { get; set; }
        public string SensoreDescription { get; set; }
        public List<SensorData> SensorDatas { get; set; }
    }

    public class SensorData
    {
        public string DataName { get; set; }
        public string Value { get; set; }
        public string Symbol { get; set; }
        public string DateTime { get; set; }
    }

    public class ServerJsonDataFormat
    {
        public string SensorName { get; set; }
        public string SensorCode { get; set; }
        public string SensorDescription { get; set; }
        public string DateTime { get; set; }
        public string DataTypeCode { get; set; }
        public string DataTypeSymbol { get; set; }
        public string DataType { get; set; }
        public string Value { get; set; }
    }
}