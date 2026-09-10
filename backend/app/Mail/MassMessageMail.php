<?php

namespace App\Mail;

use App\Models\MassMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MassMessageMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public MassMessage $message) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: $this->message->subject);
    }

    public function content(): Content
    {
        return new Content(
            htmlString: $this->message->body,
        );
    }
}
