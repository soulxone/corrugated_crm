from setuptools import setup, find_packages

with open("requirements.txt") as f:
    install_requires = f.read().strip().split("\n")

setup(
    name="corrugated_crm",
    version="0.0.1",
    description="Corrugated industry fields and spec cards for Frappe CRM",
    author="Welchwyse",
    author_email="admin@welchwyse.com",
    packages=find_packages(),
    zip_safe=False,
    include_package_data=True,
    install_requires=install_requires,
)
