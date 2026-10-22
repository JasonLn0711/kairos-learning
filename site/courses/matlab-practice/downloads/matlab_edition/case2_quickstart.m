mask = false(10,10);
mask(3:6,4:8) = true;
pixelSizeMm = 2;
areaSquareMm = nnz(mask) * pixelSizeMm^2;
disp([nnz(mask) areaSquareMm]);
