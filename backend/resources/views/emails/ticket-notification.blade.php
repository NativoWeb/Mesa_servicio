<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $subject }}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, Helvetica, sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f4f4f4; padding: 20px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    {{-- Header --}}
                    <tr>
                        <td style="background-color: #1B5E20; padding: 24px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: bold;">Mesa de Servicio TI</h1>
                            <p style="margin: 4px 0 0; color: #C8E6C9; font-size: 13px;">Unidades Tecnologicas de Santander</p>
                        </td>
                    </tr>

                    {{-- Body --}}
                    <tr>
                        <td style="padding: 30px;">
                            <p style="margin: 0 0 16px; color: #1A1A1A; font-size: 15px;">
                                Hola <strong>{{ $recipientName }}</strong>,
                            </p>

                            <p style="margin: 0 0 24px; color: #1A1A1A; font-size: 14px; line-height: 1.6;">
                                {{ $bodyMessage }}
                            </p>

                            {{-- Ticket details --}}
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; border-radius: 6px; border: 1px solid #e5e7eb; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 16px 20px; border-bottom: 1px solid #e5e7eb;">
                                        <span style="color: #6B7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Numero de Ticket</span><br>
                                        <strong style="color: #1B5E20; font-size: 16px;">#{{ $ticket->ticket_number }}</strong>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 20px; border-bottom: 1px solid #e5e7eb;">
                                        <span style="color: #6B7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Asunto</span><br>
                                        <span style="color: #1A1A1A; font-size: 14px;">{{ $ticket->title }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 20px; border-bottom: 1px solid #e5e7eb;">
                                        <span style="color: #6B7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Prioridad</span><br>
                                        <span style="color: #1A1A1A; font-size: 14px;">{{ $ticket->priority->value }}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 20px;">
                                        <span style="color: #6B7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Estado</span><br>
                                        <span style="color: #1A1A1A; font-size: 14px;">{{ $ticket->status->value }}</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td style="background-color: #f9fafb; padding: 16px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0; color: #6B7280; font-size: 11px; line-height: 1.5;">
                                Este es un mensaje automatico, no responda a este correo.<br>
                                Mesa de Servicio TI &mdash; Unidades Tecnologicas de Santander
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
