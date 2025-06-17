
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Clock, Plus } from "lucide-react";

interface Auction {
  id: string;
  title: string;
  description: string;
  current_bid: number;
  end_time: string;
  status: string;
}

interface Bid {
  id: string;
  user_id: string;
  amount: number;
  timestamp: string;
  user_email: string;
}

const AuctionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [auction, setAuction] = useState<Auction | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [newBidAmount, setNewBidAmount] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simuler le chargement des données d'enchère
    const mockAuction: Auction = {
      id: id || "1",
      title: "Montre Vintage Rolex",
      description: "Magnifique montre vintage Rolex Submariner de 1965 en excellent état. Cette pièce rare présente tous les détails authentiques et a été soigneusement entretenue. Parfaite pour les collectionneurs.",
      current_bid: 2500,
      end_time: "2024-12-25T15:30:00Z",
      status: "active"
    };

    const mockBids: Bid[] = [
      {
        id: "1",
        user_id: "user1",
        amount: 2500,
        timestamp: "2024-06-17T10:30:00Z",
        user_email: "john@example.com"
      },
      {
        id: "2", 
        user_id: "user2",
        amount: 2300,
        timestamp: "2024-06-17T09:15:00Z",
        user_email: "marie@example.com"
      },
      {
        id: "3",
        user_id: "user3", 
        amount: 2100,
        timestamp: "2024-06-17T08:45:00Z",
        user_email: "pierre@example.com"
      }
    ];

    setAuction(mockAuction);
    setBids(mockBids);
  }, [id]);

  const formatTimeRemaining = (endTime: string) => {
    const now = new Date();
    const end = new Date(endTime);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Terminé";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}j ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleSubmitBid = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auction) return;
    
    const bidAmount = parseFloat(newBidAmount);
    
    if (bidAmount <= auction.current_bid) {
      toast({
        title: "Enchère invalide",
        description: "Votre offre doit être supérieure à l'enchère actuelle",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simuler l'envoi de l'offre
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newBid: Bid = {
        id: Date.now().toString(),
        user_id: "current_user",
        amount: bidAmount,
        timestamp: new Date().toISOString(),
        user_email: "vous@example.com"
      };
      
      setBids(prev => [newBid, ...prev]);
      setAuction(prev => prev ? { ...prev, current_bid: bidAmount } : null);
      setNewBidAmount("");
      
      toast({
        title: "Offre soumise",
        description: "Votre enchère a été enregistrée avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!auction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Détails de l'enchère */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl">{auction.title}</CardTitle>
                <Badge variant="outline">
                  {auction.status === "active" ? "Actif" : "Terminé"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Image de l'article</span>
                </div>
                
                <p className="text-gray-700">{auction.description}</p>
                
                <div className="bg-accent p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Enchère actuelle</span>
                      <p className="text-2xl font-bold text-primary">
                        {auction.current_bid.toLocaleString()} €
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Temps restant</span>
                      <p className="text-lg font-semibold flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatTimeRemaining(auction.end_time)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulaire d'enchère et historique */}
          <div className="space-y-6">
            {/* Formulaire d'enchère */}
            <Card>
              <CardHeader>
                <CardTitle>Placer une enchère</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitBid} className="space-y-4">
                  <div>
                    <Label htmlFor="bidAmount">Montant (€)</Label>
                    <Input
                      id="bidAmount"
                      type="number"
                      step="0.01"
                      min={auction.current_bid + 0.01}
                      value={newBidAmount}
                      onChange={(e) => setNewBidAmount(e.target.value)}
                      placeholder={`Minimum: ${(auction.current_bid + 1).toLocaleString()} €`}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || auction.status !== "active"}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {isSubmitting ? "Soumission..." : "Enchérir"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Historique des enchères */}
            <Card>
              <CardHeader>
                <CardTitle>Historique des enchères</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {bids.map((bid) => (
                    <div key={bid.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{bid.amount.toLocaleString()} €</p>
                        <p className="text-sm text-gray-600">
                          {bid.user_email} • {new Date(bid.timestamp).toLocaleString('fr-FR')}
                        </p>
                      </div>
                    </div>
                  ))}
                  {bids.length === 0 && (
                    <p className="text-gray-500 text-center">Aucune enchère pour le moment</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;
