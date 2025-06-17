
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "lucide-react";

interface UserBid {
  id: string;
  auction_title: string;
  amount: number;
  timestamp: string;
  status: "active" | "won" | "lost";
}

const UserProfile = () => {
  const [userBids, setUserBids] = useState<UserBid[]>([]);
  const [userData] = useState({
    email: "john.doe@example.com",
    role: "user",
    totalBids: 12,
    wonAuctions: 3
  });

  useEffect(() => {
    // Simuler le chargement des données utilisateur
    const mockBids: UserBid[] = [
      {
        id: "1",
        auction_title: "Montre Vintage Rolex",
        amount: 2500,
        timestamp: "2024-06-17T10:30:00Z",
        status: "active"
      },
      {
        id: "2",
        auction_title: "Tableau Impressionniste",
        amount: 1800,
        timestamp: "2024-06-16T14:20:00Z",
        status: "won"
      },
      {
        id: "3",
        auction_title: "Appareil Photo Leica",
        amount: 950,
        timestamp: "2024-06-15T09:15:00Z",
        status: "lost"
      },
      {
        id: "4",
        auction_title: "Sculpture Bronze",
        amount: 3200,
        timestamp: "2024-06-14T16:45:00Z",
        status: "won"
      },
      {
        id: "5",
        auction_title: "Livre Ancien",
        amount: 450,
        timestamp: "2024-06-13T11:30:00Z",
        status: "lost"
      }
    ];

    setUserBids(mockBids);
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700">En cours</Badge>;
      case "won":
        return <Badge variant="outline" className="bg-green-50 text-green-700">Remporté</Badge>;
      case "lost":
        return <Badge variant="outline" className="bg-red-50 text-red-700">Perdu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Mon Profil
          </h1>
          <p className="text-gray-600">
            Gérez votre compte et consultez l'historique de vos enchères
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations utilisateur */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{userData.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Rôle</label>
                  <p className="text-gray-900 capitalize">{userData.role}</p>
                </div>
                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">{userData.totalBids}</p>
                      <p className="text-sm text-gray-600">Enchères placées</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-600">{userData.wonAuctions}</p>
                      <p className="text-sm text-gray-600">Enchères remportées</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Historique des enchères */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Historique des enchères</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Article</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Statut</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userBids.map((bid) => (
                      <TableRow key={bid.id}>
                        <TableCell className="font-medium">
                          {bid.auction_title}
                        </TableCell>
                        <TableCell>
                          {bid.amount.toLocaleString()} €
                        </TableCell>
                        <TableCell>
                          {new Date(bid.timestamp).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(bid.status)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {userBids.length === 0 && (
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

export default UserProfile;
