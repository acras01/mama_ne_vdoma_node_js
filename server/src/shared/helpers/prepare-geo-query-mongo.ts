export interface IPrepareGeoParams {
  lat: number;
  lon: number;
  radius: number;
}
export function PrepareGeoQuery(data: IPrepareGeoParams) {
  const { radius } = data;
  let newRadius: number;
  if (radius < 1000) {
    newRadius = 1000;
  }
  newRadius += 1000;
  if (radius > 25000) {
    newRadius = 25000;
  }
  const query = {
    $near: {
      $geometry: {
        type: 'Point',
        coordinates: [data.lon, data.lat],
      },
      $maxDistance: newRadius,
    },
  };
  return query;
}
