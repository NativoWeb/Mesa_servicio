<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>{{ $title }}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; color: #1A1A1A; margin: 30px; }
        h1 { color: #1B5E20; font-size: 20px; margin-bottom: 5px; }
        .date { color: #6B7280; font-size: 10px; margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background-color: #1B5E20; color: #fff; text-align: left; padding: 8px 10px; font-size: 11px; text-transform: uppercase; }
        td { padding: 6px 10px; border-bottom: 1px solid #e5e7eb; }
        tr:nth-child(even) td { background-color: #f9fafb; }
        .section-title { font-size: 14px; font-weight: bold; margin: 15px 0 5px; color: #1B5E20; }
        .total { font-size: 16px; font-weight: bold; margin-top: 10px; }
        .footer { margin-top: 30px; font-size: 9px; color: #6B7280; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 10px; }
    </style>
</head>
<body>
    <h1>{{ $title }}</h1>
    <p class="date">Generado: {{ $generatedAt }}</p>

    @foreach ($summary as $section => $data)
        @if ($section === 'total')
            <p class="total">Total general: {{ $data }}</p>
        @else
            <div class="section-title">{{ ucfirst(str_replace(['by_', '_'], ['', ' '], $section)) }}</div>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Cantidad</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($data as $key => $value)
                        <tr>
                            <td>{{ ucfirst($key) }}</td>
                            <td>{{ $value }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @endif
    @endforeach

    <div class="footer">Mesa de Servicio TI &mdash; Unidades Tecnologicas de Santander</div>
</body>
</html>
