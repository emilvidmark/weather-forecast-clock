import requests

parameters_to_collect = ['Wsymb2']
#Weather Data for Luleå

def get_weather_forecast(longitude, latitude, parameters_to_collect):

    def _get_hourly_data_from_weather_forecast(time_stamp_data):
        result = {}
        result['time'] = (time_stamp_data['validTime'][11:16])
        
        for parameter in time_stamp_data['parameters']:
            if parameter['name'] in parameters_to_collect:
                result[parameter['name']] = parameter['values'][0]
        return result


    
    url = "https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/" + longitude + "/lat/" + latitude + "/data.json"
    response = requests.get(url)
    data = response.json()
    result_set = []
    
    for time_stamp_data in data['timeSeries']:        
        result_set.append(_get_hourly_data_from_weather_forecast(time_stamp_data))
        
    return result_set

    

    
print(get_weather_forecast("22.153005", "65.584859", parameters_to_collect))
