<?php

namespace App\Mail;

use App\Models\Ticket;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TicketNotificationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $mailSubject,
        public string $recipientName,
        public Ticket $ticket,
        public string $bodyMessage,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: $this->mailSubject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.ticket-notification',
            with: [
                'subject' => $this->mailSubject,
                'recipientName' => $this->recipientName,
                'ticket' => $this->ticket,
                'bodyMessage' => $this->bodyMessage,
            ],
        );
    }
}
