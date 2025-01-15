<?php

namespace App\Services;

use GuzzleHttp\Client;

class SupabaseService
{
    protected $supabaseUrl;
    protected $supabaseKey;
    protected $bucket;
    protected $client;

    public function __construct()
    {
        $this->supabaseUrl = config('services.supabase.url');
        $this->supabaseKey = config('services.supabase.key');
        $this->bucket = config('services.supabase.bucket');
        $this->client = new Client([
            'base_uri' => $this->supabaseUrl,
            'headers' => [
                'Authorization' => 'Bearer ' . $this->supabaseKey,
                'Content-Type'  => 'image/png',
            ],
        ]);
    }

    public function uploadImage($file, $path)
    {
        $fileName = $path . '/' . uniqid() . '.' . $file->getClientOriginalExtension();

        $response = $this->client->post("/storage/v1/object/$this->bucket/$fileName", [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->supabaseKey,
                'Content-Type'  => $file->getMimeType(),
            ],
            'body' => file_get_contents($file),
        ]);

        if ($response->getStatusCode() !== 200) {
            throw new \Exception('Failed to upload file to Supabase');
        }

        return [
            'file_name' => $fileName,
            'url'       => $this->supabaseUrl . "/storage/v1/object/public/$this->bucket/$fileName",
        ];
    }

    public function deleteImage($url)
    {
        try{
            $urlPublicRemoved = str_replace('/public', '', $url);
            $response = $this->client->delete($urlPublicRemoved, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->supabaseKey,
                ],
            ]);

            if ($response->getStatusCode() !== 200 && $response->getStatusCode() !== 204) {
                // throw new \Exception('Failed to delete file from Supabase');
                return false;
            }
        }catch(\Exception $e){
            // throw new \Exception('Failed to delete file from Supabase');
            return false;
        }

        return true;
    }

}
