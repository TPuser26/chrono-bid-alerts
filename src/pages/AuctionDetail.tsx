
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Clock, Plus } from "lucide-react";
import { useRealtimeAuctions } from "@/hooks/useRealtimeAuctions";
import { useBids } from "@/hooks/useBids";

const AuctionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [newBidAmount, setNewBidAmount] = useState("");
  
  const { auctions, isLoading: auctionsLoading } = useRealtimeAuctions();
  const { bids, isLoading: bidsLoading, submitBid } = useBids(id);
  
  const auction = auctions?.find(a => a.id === id);

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
    
    if (!auction || !id) return;
    
    const bidAmount = parseFloat(newBidAmount);
    
    if (isNaN(bidAmount) || bidAmount <= 0) {
      toast({
        title: "Enchère invalide",
        description: "Veuillez entrer un montant valide",
        variant: "destructive"
      });
      return;
    }

    try {
      await submitBid.mutateAsync({
        auctionId: id,
        amount: bidAmount
      });
      setNewBidAmount("");
    } catch (error) {
      // L'erreur est déjà gérée dans le hook useBids
    }
  };

  if (auctionsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Chargement...</div>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Enchère non trouvée</div>
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
                        {auction.current_bid?.toLocaleString() || 0} €
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
                      min={(auction.current_bid || 0) + 0.01}
                      value={newBidAmount}
                      onChange={(e) => setNewBidAmount(e.target.value)}
                      placeholder={`Minimum: ${((auction.current_bid || 0) + 1).toLocaleString()} €`}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={submitBid.isPending || auction.status !== "active"}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {submitBid.isPending ? "Soumission..." : "Enchérir"}
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
                  {bidsLoading ? (
                    <p className="text-gray-500 text-center">Chargement...</p>
                  ) : bids && bids.length > 0 ? (
                    bids.map((bid) => (
                      <div key={bid.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{bid.amount.toLocaleString()} €</p>
                          <p className="text-sm text-gray-600">
                            {bid.profiles?.email} • {new Date(bid.timestamp).toLocaleString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
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
