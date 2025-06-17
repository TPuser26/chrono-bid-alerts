
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash } from "lucide-react";

interface Auction {
  id: string;
  title: string;
  description: string;
  current_bid: number;
  end_time: string;
  status: string;
}

const AdminPanel = () => {
  const { toast } = useToast();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newAuction, setNewAuction] = useState({
    title: "",
    description: "",
    start_bid: "",
    end_time: ""
  });

  // Vérifier si l'utilisateur est admin (simulation)
  const isAdmin = true; // Dans une vraie app, ceci viendrait de l'auth

  useEffect(() => {
    // Simuler le chargement des enchères
    const mockAuctions: Auction[] = [
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
    ];

    setAuctions(mockAuctions);
  }, []);

  const handleCreateAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // Simuler la création d'enchère
      await new Promise(resolve => setTimeout(resolve, 1000));

      const auction: Auction = {
        id: Date.now().toString(),
        title: newAuction.title,
        description: newAuction.description,
        current_bid: parseFloat(newAuction.start_bid) || 0,
        end_time: newAuction.end_time,
        status: "active"
      };

      setAuctions(prev => [...prev, auction]);
      setNewAuction({ title: "", description: "", start_bid: "", end_time: "" });
      
      toast({
        title: "Enchère créée",
        description: "La nouvelle enchère a été créée avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAuction = async (auctionId: string, auctionTitle: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'enchère "${auctionTitle}" ?`)) {
      return;
    }

    try {
      // Simuler la suppression
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAuctions(prev => prev.filter(auction => auction.id !== auctionId));
      
      toast({
        title: "Enchère supprimée",
        description: "L'enchère a été supprimée avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression",
        variant: "destructive"
      });
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-2">Accès refusé</h2>
              <p className="text-gray-600">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Panneau d'Administration
          </h1>
          <p className="text-gray-600">
            Gérez les enchères et supervisez la plateforme
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de création */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Créer une enchère
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateAuction} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre</Label>
                    <Input
                      id="title"
                      value={newAuction.title}
                      onChange={(e) => setNewAuction(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Titre de l'enchère"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newAuction.description}
                      onChange={(e) => setNewAuction(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description détaillée"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="start_bid">Enchère de départ (€)</Label>
                    <Input
                      id="start_bid"
                      type="number"
                      step="0.01"
                      min="0"
                      value={newAuction.start_bid}
                      onChange={(e) => setNewAuction(prev => ({ ...prev, start_bid: e.target.value }))}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="end_time">Date de fin</Label>
                    <Input
                      id="end_time"
                      type="datetime-local"
                      value={newAuction.end_time}
                      onChange={(e) => setNewAuction(prev => ({ ...prev, end_time: e.target.value }))}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isCreating}>
                    <Plus className="h-4 w-4 mr-2" />
                    {isCreating ? "Création..." : "Créer l'enchère"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Liste des enchères */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Enchères existantes</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Enchère actuelle</TableHead>
                      <TableHead>Fin</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auctions.map((auction) => (
                      <TableRow key={auction.id}>
                        <TableCell className="font-medium">
                          {auction.title}
                        </TableCell>
                        <TableCell>
                          {auction.current_bid.toLocaleString()} €
                        </TableCell>
                        <TableCell>
                          {new Date(auction.end_time).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {auction.status === "active" ? "Actif" : "Terminé"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAuction(auction.id, auction.title)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {auctions.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Aucune enchère trouvée</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
