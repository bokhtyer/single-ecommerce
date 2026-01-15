<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="title" content="Single Product E-commerce">
    <meta name="description" content="Single Product E-commerce built with Laravel, Inertia.js, and React.">
    <meta name="author" content="Your Name or Company">
    <link rel="icon" href="/favicon.ico" type="image/x-icon">

    <title>Single Product E-commerce</title>
    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
</head>
<body>
    @inertia
</body>
</html>
