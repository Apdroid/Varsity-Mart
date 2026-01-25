'use client';

import {AdminLayout} from '@/components/admin/layout';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Textarea} from '@/components/ui/textarea';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from '@/components/ui/select';
import {Switch} from '@/components/ui/switch';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Bell, Database, Save, Shield} from 'lucide-react';

export default function SettingsPage() {
    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage platform settings and preferences</p>
                </div>

                {/* Settings Tabs */}
                <Tabs defaultValue="general" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>

                    {/* General Settings */}
                    <TabsContent value="general" className="space-y-4">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Platform Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="platform-name">Platform Name</Label>
                                    <Input
                                        id="platform-name"
                                        defaultValue="VarsityMart"
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="platform-email">Support Email</Label>
                                    <Input
                                        id="platform-email"
                                        type="email"
                                        defaultValue="support@varsitymart.com"
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="platform-phone">Support Phone</Label>
                                    <Input
                                        id="platform-phone"
                                        defaultValue="+1 (555) 123-4567"
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="platform-description">Platform Description</Label>
                                    <Textarea
                                        id="platform-description"
                                        defaultValue="Campus marketplace for students to buy and sell items"
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Commission Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="seller-commission">Seller Commission (%)</Label>
                                    <Input
                                        id="seller-commission"
                                        type="number"
                                        defaultValue="10"
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="restaurant-commission">Restaurant Commission (%)</Label>
                                    <Input
                                        id="restaurant-commission"
                                        type="number"
                                        defaultValue="15"
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="buyer-fee">Buyer Service Fee (%)</Label>
                                    <Input
                                        id="buyer-fee"
                                        type="number"
                                        defaultValue="2"
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Notification Settings */}
                    <TabsContent value="notifications" className="space-y-4">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Bell className="h-5 w-5"/>
                                Notification Preferences
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <p className="font-medium">Email Notifications</p>
                                        <p className="text-sm text-muted-foreground">Receive platform updates via
                                            email</p>
                                    </div>
                                    <Switch defaultChecked/>
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <p className="font-medium">KYC Alerts</p>
                                        <p className="text-sm text-muted-foreground">Get notified about pending KYC
                                            submissions</p>
                                    </div>
                                    <Switch defaultChecked/>
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <p className="font-medium">Order Alerts</p>
                                        <p className="text-sm text-muted-foreground">Receive alerts for critical
                                            orders</p>
                                    </div>
                                    <Switch defaultChecked/>
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                    <div>
                                        <p className="font-medium">User Activity</p>
                                        <p className="text-sm text-muted-foreground">Get notified about suspicious user
                                            activity</p>
                                    </div>
                                    <Switch/>
                                </div>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Security Settings */}
                    <TabsContent value="security" className="space-y-4">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Shield className="h-5 w-5"/>
                                Security Settings
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="current-password">Current Password</Label>
                                    <Input
                                        id="current-password"
                                        type="password"
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="new-password">New Password</Label>
                                    <Input
                                        id="new-password"
                                        type="password"
                                        className="mt-2"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                    <Input
                                        id="confirm-password"
                                        type="password"
                                        className="mt-2"
                                    />
                                </div>
                                <Button className="w-full md:w-auto">Update Password</Button>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Enable 2FA</p>
                                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your
                                        account</p>
                                </div>
                                <Switch/>
                            </div>
                        </Card>
                    </TabsContent>

                    {/* Advanced Settings */}
                    <TabsContent value="advanced" className="space-y-4">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Database className="h-5 w-5"/>
                                Database Settings
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="backup-frequency">Backup Frequency</Label>
                                    <Select>
                                        <SelectTrigger className="mt-2">
                                            <SelectValue placeholder="Select frequency"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="hourly">Hourly</SelectItem>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button variant="outline" className="w-full md:w-auto bg-transparent">
                                    Create Backup Now
                                </Button>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">Cache Settings</h3>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">Clear cache to refresh all data</p>
                                <Button variant="outline" className="w-full md:w-auto bg-transparent">
                                    Clear Cache
                                </Button>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4">API Settings</h3>
                            <div>
                                <Label htmlFor="api-key">API Key</Label>
                                <Input
                                    id="api-key"
                                    value="sk_live_51234567890abcdefghijklmnop"
                                    readOnly
                                    className="mt-2 font-mono text-sm"
                                />
                                <Button variant="outline" className="mt-3 w-full md:w-auto bg-transparent">
                                    Regenerate Key
                                </Button>
                            </div>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Save Button */}
                <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button className="gap-2">
                        <Save className="h-4 w-4"/>
                        Save Changes
                    </Button>
                </div>
            </div>
        </AdminLayout>
    );
}
