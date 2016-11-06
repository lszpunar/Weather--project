using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using Android.App;
using Android.Appwidget;
using Android.Content;
using Android.OS;
using Android.Widget;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Uri = Android.Net.Uri;

namespace Weather
{
    public class UpdateService : Service
    {
        public override IBinder OnBind(Intent intent)
        {
            return null;
        }

        /// <param name="intent">To be added.</param>
        /// <param name="startId">To be added.</param>
        /// <summary />
        /// <remarks>
        ///     <para tool="javadoc-to-mdoc" />
        ///     <para tool="javadoc-to-mdoc">
        ///         <format type="text/html">
        ///             <a
        ///                 href="http://developer.android.com/reference/android/app/Service.html#onStart(android.content.Intent, int)"
        ///                 target="_blank">
        ///                 [Android Documentation]
        ///             </a>
        ///         </format>
        ///     </para>
        /// </remarks>
        /// <since version="Added in API level 1" />
        [Obsolete("deprecated")]
        public override void OnStart(Intent intent, int startId)
        {
            //Build the widget update for today
            var updateViews = BuildUpdate(this);

            // Push update for this widget to the home screen
            var thisWidget = new ComponentName(this, typeof (WeatherWidget).Name);
            var manager = AppWidgetManager.GetInstance(this);

            manager.UpdateAppWidget(thisWidget, updateViews);
        }


        // Build a widget update to show the current Wiktionary
        // "Word of the day." Will block until the online API returns.
        public RemoteViews BuildUpdate(Context context)
        {
            // 
            var lastSensoreData = GetLatestSensorsData();

            // Build an update that holds the updated widget contents
            var updateViews = new RemoteViews(context.PackageName, JniIdentityHashCode);


            foreach (var sensor in lastSensoreData)
            {
                updateViews.SetTextViewText(Resource.Id.blog_title, sensor.SensoreCode);
                updateViews.SetTextViewText(Resource.Id.creator, sensor.SensoreName);

                // When user clicks on widget, launch to Wiktionary definition page
                if (!string.IsNullOrEmpty(string.Empty))
                {
                    var defineIntent = new Intent(Intent.ActionView, Uri.Parse("test"));

                    var pendingIntent = PendingIntent.GetActivity(context, 0, defineIntent, 0);
                    updateViews.SetOnClickPendingIntent(Resource.Id.widget, pendingIntent);
                }
            }


            return updateViews;
        }

        private List<Sensor> GetLatestSensorsData()
        {
            var sensorsDataToPresentation = new List<Sensor>();
            using (var webClient = new WebClient())
            {
                var uri = new System.Uri(Global.GetLatestSensoreDataAddress);
                webClient.Headers[HttpRequestHeader.ContentType] = "application/json; charset=utf-8";
                var json = webClient.DownloadData(uri);


                var jsonStr = Encoding.UTF8.GetString(json);

                if (json != null)
                {
                    //List<ServerJsonDataFormat> outObject = JsonConvert.DeserializeObject<List<ServerJsonDataFormat>>(json);
                    List<ServerJsonDataFormat> deserializedServerData =
                        JsonConvert.DeserializeObject<List<ServerJsonDataFormat>>(jsonStr);
                    //var result = JsonConvert.SerializeObject(jsonStr, Formatting.Indented);
                    var bob = JObject.Parse(json: jsonStr);

                    //using (var sr = new StringReader(json))
                    //using (var jr = new JsonTextReader(sr))
                    //{
                    //    var js = new JsonSerializer();
                    //    var u = js.Deserialize<UserResults>(jr);
                    //    Console.WriteLine(u.user.display_name);
                    //}

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
            }

            return sensorsDataToPresentation;
        }

        //    using (var reader = new StreamReader(stream))
        //    using (var stream = new MemoryStream(data))
        //{

        //public static T Deserialize<T>(byte[] data) where T : class
        //        return JsonSerializer.Create().Deserialize(reader, typeof(T)) as T;
        //}
    }
}