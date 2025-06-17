
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface Auction {
  id: string;
  title: string;
  description: string;
  current_bid: number;
  end_time: string;
  status: string;
}

const Index = () => {
  const [auctions, setAuctions] = useState<Auction[]>([
    {
      id: "1",
      title: "Montre Vintage Rolex",
      description: "Magnifique montre vintage en excellent état",
      current_bid: 2500,
      end_time: "2024-12-25T15:30:00Z",
      status: "active"
    },
    {
      id: "2", 
      title: "Tableau Impressionniste",
      description: "Œuvre d'art authentique du 19ème siècle",
      current_bid: 1800,
      end_time: "2024-12-24T18:00:00Z",
      status: "active"
    },
    {
      id: "3",
      title: "Appareil Photo Leica",
      description: "Appareil photo classique en parfait état",
      current_bid: 950,
      end_time: "2024-12-26T12:00:00Z", 
      status: "active"
    }
  ]);

  const formatTimeRemaining = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Terminé";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}j ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Enchères Actives
          </h1>
          <p className="text-gray-600">
            Découvrez les dernières enchères et placez vos offres
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <Link key={auction.id} to={`/auction/${auction.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">
                      {auction.title}
                    </CardTitle>
                    <Badge variant="outline" className="ml-2">
                      {auction.status === "active" ? "Actif" : "Terminé"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {auction.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        Enchère actuelle
                      </span>
                      <span className="text-lg font-bold text-primary">
                        {auction.current_bid.toLocaleString()} €
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>Temps restant: {formatTimeRemaining(auction.end_time)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
