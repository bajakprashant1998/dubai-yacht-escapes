import { CarRental } from "@/hooks/useCarRentals";
import { Users, Settings2, Fuel, Calendar, ShieldCheck, Car } from "lucide-react";

interface CarSpecificationsProps {
  car: CarRental;
}

const CarSpecifications = ({ car }: CarSpecificationsProps) => {
  const specs = [
    { icon: Car, label: "Brand", value: car.brand },
    { icon: Calendar, label: "Year", value: car.year.toString() },
    { icon: Users, label: "Seats", value: `${car.seats} Passengers` },
    { icon: Settings2, label: "Transmission", value: car.transmission },
    { icon: Fuel, label: "Fuel Type", value: car.fuel_type },
    { icon: ShieldCheck, label: "Deposit", value: `AED ${car.deposit}` },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {specs.map((spec) => (
        <div
          key={spec.label}
          className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg"
        >
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
            <spec.icon className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{spec.label}</p>
            <p className="font-medium">{spec.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CarSpecifications;