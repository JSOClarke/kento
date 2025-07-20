export default function ItemCard({ trip }) {
  return (
    <div>
      <div>{`Trip Point A: ${trip.startAddr}`}</div>
      <div>{`Trip Point B: ${trip.endAddr}`}</div>
      <div>{`Distance: ${trip.distance} km`}</div>
      <div>{`Duration: ${trip.duration} mins`}</div>
      <div>{`Price: £${trip.price.toFixed(2)}`}</div>
      <button></button>
    </div>
  );
}
