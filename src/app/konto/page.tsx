"use client";

import { useAuthStore } from "@/store/Auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function AccountPage() {
  const { user, logout } = useAuthStore();

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Bitte anmelden</h1>
          <p className="text-gray-600">Sie müssen angemeldet sein, um Ihr Konto zu verwalten.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Mein Konto</h1>
          <p className="text-gray-600 text-sm sm:text-base">Verwalten Sie Ihre Kontoeinstellungen und Bestellungen</p>
        </div>

        {/* User Info Card */}
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
                <AvatarImage src="" alt={user.name} />
                <AvatarFallback className="text-sm sm:text-lg bg-permdal-100 text-permdal-800">
                  {user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{user.name}</h2>
                <p className="text-gray-600 text-sm truncate">{user.email}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <Badge variant={user.emailVerification ? "default" : "secondary"} className="text-xs">
                    {user.emailVerification ? "Email verifiziert" : "Email nicht verifiziert"}
                  </Badge>
                  {user.labels?.includes("admin") && (
                    <Badge variant="destructive" className="text-xs">Admin</Badge>
                  )}
                </div>
              </div>
              <Button variant="outline" onClick={logout} className="w-full sm:w-auto">
                Abmelden
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="settings" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings" className="text-xs sm:text-sm">Kontoeinstellungen</TabsTrigger>
            <TabsTrigger value="orders" className="text-xs sm:text-sm">Meine Bestellungen</TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl">Persönliche Informationen</CardTitle>
                <CardDescription className="text-sm">
                  Aktualisieren Sie Ihre persönlichen Daten und Einstellungen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Name</label>
                    <p className="text-gray-900 mt-1 text-sm sm:text-base">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900 mt-1 text-sm sm:text-base">{user.email}</p>
                  </div>
                </div>
                <Separator />
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">Funktionen zur Bearbeitung werden bald verfügbar sein</p>
                  <Button disabled variant="outline">
                    Bearbeiten
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benachrichtigungen</CardTitle>
                <CardDescription>
                  Verwalten Sie Ihre Einstellungen für E-Mail-Benachrichtigungen
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Bestellbestätigungen</p>
                    <p className="text-sm text-gray-600">Erhalten Sie E-Mails bei neuen Bestellungen</p>
                  </div>
                  <Badge variant="secondary">Aktiviert</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marktplatz-Updates</p>
                    <p className="text-sm text-gray-600">Benachrichtigungen über neue Angebote</p>
                  </div>
                  <Badge variant="secondary">Aktiviert</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Newsletter</p>
                    <p className="text-sm text-gray-600">Regelmäßige Updates über Permdal</p>
                  </div>
                  <Badge variant="outline">Deaktiviert</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Meine Bestellungen</CardTitle>
                <CardDescription>
                  Hier finden Sie alle Ihre vergangenen und aktuellen Bestellungen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Noch keine Bestellungen</h3>
                  <p className="text-gray-600 mb-4">
                    Sie haben noch keine Bestellungen getätigt. Besuchen Sie unseren Marktplatz, um Produkte zu bestellen.
                  </p>
                  <Button asChild>
                    <a href="/marktplatz">Zum Marktplatz</a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bestellhistorie</CardTitle>
                <CardDescription>
                  Eine Übersicht über alle Ihre vergangenen Bestellungen
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-gray-500">Ihre Bestellhistorie wird hier angezeigt, sobald Sie Bestellungen getätigt haben.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
