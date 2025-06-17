
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "lucide-react";
import { useBids } from "@/hooks/useBids";
import { supabase } from "@/integrations/supabase/client";

const UserProfile = () => {
  const { getUserBids } = useBids();
  const [userData, setUserData] = useState({
    email: "",
    role: "user",
    totalBids: 0,
    wonAuctions: 0
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, role')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserData(prev => ({
            ...prev,
            email: profile.email,
            role: profile.role
          }));
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (getUserBids.data) {
      const totalBids = getUserBids.data.length;
      const wonAuctions = getUserBids.data.filter(bid => 
        bid.auctions?.status === 'ended' && 
        bid.amount === bid.auctions?.current_bid
      ).length;
      
      setUserData(prev => ({
        ...prev,
        totalBids,
        wonAuctions
      }));
    }
  }, [getUserBids.data]);

  const getStatusBadge = (bid: any) => {
    const auction = bid.auctions;
    if (!auction) return <Badge variant="outline">Inconnue</Badge>;
    
    if (auction.status === "active") {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700">En cours</Badge>;
    } else if (auction.status === "ended") {
      if (bid.amount === auction.current_bid) {
        return <Badge variant="outline" className="bg-green-50 text-green-700">Remporté</Badge>;
      } else {
        return <Badge variant="outline" className="bg-red-50 text-red-700">Perdu</Badge>;
      }
    }
    return <Badge variant="outline">Terminé</Badge>;
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
                    {getUserBids.isLoading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          Chargement...
                        </TableCell>
                      </TableRow>
                    ) : getUserBids.data && getUserBids.data.length > 0 ? (
                      getUserBids.data.map((bid) => (
                        <TableRow key={bid.id}>
                          <TableCell className="font-medium">
                            {bid.auctions?.title || 'Enchère supprimée'}
                          </TableCell>
                          <TableCell>
                            {bid.amount.toLocaleString()} €
                          </TableCell>
                          <TableCell>
                            {new Date(bid.timestamp).toLocaleDateString('fr-FR')}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(bid)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center">
                          Aucune enchère trouvée
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
