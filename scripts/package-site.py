from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
root=Path(__file__).resolve().parent.parent
with ZipFile(root/'portfolio-v3.zip','w',ZIP_DEFLATED) as archive:
    for file in sorted((root/'dist').rglob('*')):
        if file.is_file():archive.write(file,file.relative_to(root/'dist'))
print('Created portfolio-v3.zip from the verified dist output.')
