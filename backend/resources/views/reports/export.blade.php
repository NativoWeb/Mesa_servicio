<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>{{ $title }}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 10px; color: #1A1A1A; margin: 20px; }
        h1 { color: #1B5E20; font-size: 18px; margin-bottom: 5px; }
        .date { color: #6B7280; font-size: 9px; margin-bottom: 15px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background-color: #1B5E20; color: #fff; text-align: left; padding: 6px 8px; font-size: 9px; text-transform: uppercase; }
        td { padding: 5px 8px; border-bottom: 1px solid #e5e7eb; font-size: 9px; }
        tr:nth-child(even) td { background-color: #f9fafb; }
        .footer { margin-top: 20px; font-size: 8px; color: #6B7280; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 8px; }
        .count { font-size: 10px; color: #6B7280; margin-bottom: 10px; }
    </style>
</head>
<body>
    <h1>{{ $title }}</h1>
    <p class="date">Generado: {{ $generatedAt }}</p>
    <p class="count">Total de registros: {{ count($rows) }}</p>

    <table>
        <thead>
            <tr>
                @foreach ($headings as $heading)
                    <th>{{ $heading }}</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @forelse ($rows as $row)
                <tr>
                    @foreach ($row as $cell)
                        <td>{{ $cell }}</td>
                    @endforeach
                </tr>
            @empty
                <tr>
                    <td colspan="{{ count($headings) }}" style="text-align: center; padding: 20px;">
                        No se encontraron registros con los filtros aplicados.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">Mesa de Servicio TI &mdash; Unidades Tecnologicas de Santander</div>
</body>
</html>
