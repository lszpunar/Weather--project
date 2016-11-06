using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using Newtonsoft.Json;

namespace Weather
{
    internal class SensorDataReposotory
    {
        private List<Sensor> GetLatestSensorsData()
        {
            var sensorsDataToPresentation = new List<Sensor>();
            using (var webClient = new WebClient())
            {
                var uri = new Uri(Global.GetLatestSensoreDataAddress);
                webClient.Headers[HttpRequestHeader.ContentType] = "application/json; charset=utf-8";
                var json = webClient.DownloadString(uri);

                List<ServerJsonDataFormat> deserializedServerData =
                    JsonConvert.DeserializeObject<List<ServerJsonDataFormat>>(json);

                if (deserializedServerData != null)
                {
                    var groupBySensoreCode = deserializedServerData.GroupBy(s => s.SensorCode).ToList();

                    foreach (var sensoreData in groupBySensoreCode)
                    {
                        var sensor = new Sensor
                        {
                            SensoreCode = sensoreData.Key
                        };

                        var sensoreReadings = sensoreData.ToList();
                        foreach (var sensoreReadingsDetails in sensoreReadings)
                        {
                            sensor.SensoreName = sensoreReadingsDetails.SensorName;
                            sensor.SensoreDescription = sensoreReadingsDetails.SensorDescription;

                            var sensorDataCos = new SensorData
                            {
                                DataName = sensoreReadingsDetails.DataType,
                                DateTime = sensoreReadingsDetails.DateTime,
                                Symbol = sensoreReadingsDetails.DataTypeSymbol,
                                Value = sensoreReadingsDetails.Value
                            };

                            sensor.SensorDatas.Add(sensorDataCos);
                        }
                        sensorsDataToPresentation.Add(sensor);
                    }
                }
            }

            return sensorsDataToPresentation;
        }
    }
}