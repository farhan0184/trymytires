import { updateAdminSettings } from '@/app/helper/backend';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea';
import React from 'react'
import toast from 'react-hot-toast';

export default function HomeSetting({ settings, handleChange }) {
    const handleSubmit = async () => {


        const data = await updateAdminSettings(settings);
        if (data.success) {
            toast.success(data.message || "Updated successfully!");
        } else {
            toast.error(data.errorMessage || "Failed to update.");
        }
    };
    return (
        <div>
            <h2 className="font-bold mb-4 subtitleText">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block mb-1 font-medium subtitleText">Site Name</label>
                    <Input
                        className={'subtitleText h-10'}
                        value={settings.site_name}
                        onChange={(e) => handleChange("site_name", e.target.value)}
                        placeholder="Enter site name"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium subtitleText">Site Email</label>
                    <Input
                        className={'subtitleText h-10'}
                        value={settings.site_email}
                        onChange={(e) => handleChange("site_email", e.target.value)}
                        type="email"
                        placeholder="Enter site email"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium subtitleText">Site Phone</label>
                    <Input
                        className={'subtitleText h-10'}
                        value={settings.site_phone}
                        onChange={(e) => handleChange("site_phone", e.target.value)}
                        placeholder="Enter site phone"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium subtitleText">Site Logo</label>
                    <Input
                        className={'subtitleText h-10'}
                        value={settings.site_logo}
                        onChange={(e) => handleChange("site_logo", e.target.value)}
                        placeholder="Enter site logo URL"
                    />
                </div>

                <div className="col-span-2">
                    <label className="block mb-1 font-medium subtitleText">Site Description</label>
                    <Textarea
                        className={'subtitleText '}
                        value={settings.site_description}
                        onChange={(e) =>
                            handleChange("site_description", e.target.value)
                        }
                        placeholder="Enter site description"
                    />
                </div>

                <div className="col-span-2">
                    <label className="block mb-1 font-medium subtitleText">Site Address</label>
                    <Textarea
                        className={'subtitleText '}
                        value={settings.site_address}
                        onChange={(e) => handleChange("site_address", e.target.value)}
                        placeholder="Enter site address"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium subtitleText">Client Side URL</label>
                    <Input
                        className={'subtitleText h-10'}
                        value={settings.client_side_url}
                        onChange={(e) =>
                            handleChange("client_side_url", e.target.value)
                        }
                        placeholder="Enter client side URL"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium subtitleText">Server Side URL</label>
                    <Input
                        className={'subtitleText h-10'}
                        value={settings.server_side_url}
                        onChange={(e) =>
                            handleChange("server_side_url", e.target.value)
                        }
                        placeholder="Enter server side URL"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium subtitleText">Currency Code</label>
                    <Input
                        className={'subtitleText h-10'}
                        value={settings.currency_code}
                        onChange={(e) => handleChange("currency_code", e.target.value)}
                        placeholder="Enter currency code"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium subtitleText">Currency Symbol</label>
                    <Input
                        className={'subtitleText h-10'}
                        value={settings.currency_symbol}
                        onChange={(e) =>
                            handleChange("currency_symbol", e.target.value)
                        }
                        placeholder="Enter currency symbol"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-medium subtitleText">File Upload Type</label>
                    <Select

                        value={settings.file_upload_type}
                        onValueChange={(value) =>
                            handleChange("file_upload_type", value)
                        }
                    >
                        <SelectTrigger className={'subtitleText h-10'}>
                            <SelectValue placeholder="Select upload type" />
                        </SelectTrigger>
                        <SelectContent >
                            <SelectItem value="s3" className={'subtitleText'}>Amazon S3</SelectItem>
                            <SelectItem value="local" className={'subtitleText'}>Local</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="block mb-1 font-medium subtitleText">Site Footer</label>
                    <Input
                        className={'subtitleText h-10'}
                        value={settings.site_footer}
                        onChange={(e) => handleChange("site_footer", e.target.value)}
                        placeholder="Enter site footer"
                    />
                </div>
            </div>
            <Button className="mt-4 subtitleText h-10" onClick={() => handleSubmit("general")}>
                Save General
            </Button>
        </div>
    )
}
