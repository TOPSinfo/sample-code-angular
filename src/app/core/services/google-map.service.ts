import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';
import { ToastrService } from 'ngx-toastr';
declare var google;

@Injectable({
  providedIn: 'root'
})
export class GoogleMapService {
  constructor(private toastrService: ToastrService) { }

  public geocodePlaceId(placeId) {
    return new Promise((resolve, reject) => {
      const self = this;
      if (!placeId) {
        reject('Please provide place id.');
        return;
      }
      const geocoder = new google.maps.Geocoder;
      geocoder.geocode({ 'placeId': placeId }, function (results, status) {
        if (String(status) === 'OK') {
          if (results[0]) {
            resolve(self.retrieveDetails(results[0]));
          } else {
            resolve();
            console.log('No results found');
          }
        } else {
          reject(status);
          // window.alert('Geocoder failed due to: ' + status);
        }
      });
    });
  }

  findUserLocation() {
    return new Promise((resolve, reject) => {
      if (window.navigator.geolocation) {
        const self = this;
        const geocoder = new google.maps.Geocoder;
        window.navigator.geolocation.getCurrentPosition(function (pos) {
          console.log('&j', pos);
          geocoder.geocode({ 'location': { lat: pos.coords.latitude, lng: pos.coords.longitude } }, function (results, status) {
            if (status === 'OK') {
              if (results[0]) {
                resolve(self.retrieveDetails(results[0]));
              } else {
                reject('No results found');
                console.log('No results found');
              }
            } else {
              reject(`Geocoder failed due to:  ${status}`);
              console.log(`Geocoder failed due to:  ${status}`);
            }
          });
        }, (error => {
          if (error.message === 'User denied Geolocation') {
            this.toastrService.info('Location is disabled please enable the location.');
          }
        }));
      } else {
        console.log('Browser doesnt support geolocation');
      }
    });
  }

  retrieveDetails(results) {
    let addressAllDetails = {};
    const address = results.address_components ? results.address_components : [];
    for (const i of address) {
      addressAllDetails[i.types[0]] = i.long_name;
    }
    const obj = {
      'lat': results.geometry.location.lat(),
      'lng': results.geometry.location.lng(),
      'place_id': results.place_id,
      'place_name': results.name,
      'formatted_address': results.formatted_address
    };
    addressAllDetails = { ...obj, ...addressAllDetails };
    return addressAllDetails;
  }

}
